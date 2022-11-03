import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User';
import { sendRecoverPasswordMail } from 'App/Services/sendMail';

const EXPIRES_IN = Env.get('NODE_ENV') === 'development' ? '' : '30mins'

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        try {
            const { email, password } = request.only(['email', 'password']);
            const user = await User.query().where('email', email).preload('roles').first();
            const token = await auth.use('api').attempt(email, password,
                { name: user?.name, expiresIn: EXPIRES_IN });
            return response.ok({ user: user, token: token });
        } catch (error) {
            return response.forbidden({ message: "Invalid credentials", error: error });
        }
    }

    public async generateRecoverPasswordToken({ auth, request, response }: HttpContextContract) {
        const { email } = request.only(['email']);

        try {
            const user = await User.findByOrFail('email', email);
            const { tokenHash } = await auth.use('api').generate(user);
            user.merge({ rememberMeToken: tokenHash }).save();
            await sendRecoverPasswordMail(user, tokenHash, 'email/recover');
            return response.ok({ message: 'Token created successfully' });
        } catch (error) {
            return response.badRequest({ message: 'Error sending recover email', originalMessage: error.message });
        }
    }

    public async updatePassword({ params, request, response }: HttpContextContract) {
        const { password } = request.only(['password']);
        const { token } = params;

        try {
            const user = await User.findByOrFail('remember_me_token', token);
            user.merge({ password: password }).save();
            user.merge({ rememberMeToken: null }).save();
            return response.ok({ message: 'Password updated!' });
        } catch (error) {
            return response.notFound({ message: 'Error updating password', originalMessage: error.message });
        }
    }
}
