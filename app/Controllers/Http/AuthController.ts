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

    // public async recoverPassword({ auth, response }: HttpContextContract) {
    //     const user = auth.user;
        
    //     try {
    //         await sendRecoverPasswordMail(user as User, 'email/recover');
    //     } catch (error) {

    //     }
    // }
}
