import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import WelcomeEmail from 'App/Mailers/WelcomeEmail';
import Role from 'App/Models/Role';
import User from 'App/Models/User'
import StoreValidator from 'App/Validators/User/StoreValidator';
import UpdateValidator from 'App/Validators/User/UpdateValidator';

export default class UsersController {
  public async index({ bouncer, request, response }: HttpContextContract) {
    await bouncer.authorize('is adm');
    const { page, perPage, noPaginate } = request.qs();
    try {
      if (noPaginate) {
        const users = await User
          .query()
          .preload('roles', roles => roles.select('name'))
        return response.ok(users)
      }
      const users = await User
        .query()
        .preload('roles', roles => roles.select('name'))
        .paginate(page || 1, perPage || 10);
      return response.ok(users)
    } catch (error) {
      return response.notFound({ error })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(StoreValidator);
    const requestBody = request.only(["name", "email", "password"]);

    const trx = await Database.transaction();

    let newUser: User;
    try {
      newUser = await User.create(requestBody, trx);
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }

    try {
      const player = await Role.findBy('name', 'player', trx)
      if (player === null) throw new Error();
      if (player) newUser.related('roles').attach([player.id])
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }
    let user: User | null;
    try {
      user = await User.query().where('email', newUser.email).preload('roles').firstOrFail();
      response.created(user);
    } catch (error) {
      return response.badRequest({ message: 'error creating user', originalError: error.message });
    }

    try {
      const welcomeEmail = new WelcomeEmail(user);
      await welcomeEmail.send()
      trx.commit();
    } catch (error) {
      trx.rollback();
      return response.badRequest({ message: 'Error sending welcome email', original: error.message });
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    const userSecureId = params.id;
    const userAuthenticated = auth.user;

    try {
      if (userSecureId !== userAuthenticated?.secureId)
        throw new Error('You are not authorized to see this user info');
    } catch (error) {
        return response.forbidden({ message: error.message })
    }

    try {
      const user = await User
        .query()
        .where('secure_id', params.id)
        .preload('bets', (bets) => {
          const today = new Date();
          today.setMonth(today.getMonth() - 1);
          const formated = today.toLocaleDateString('en-US').replace(/\//g, '-');
          bets.where('created_at', '>', formated);
        })
        .first();
      if (!user) {
        throw new Error('User not found')
      }
      response.ok(user);
    } catch (error) {
      response.notFound({ message: error.message });
    }

  }

  public async update({ auth, request, params, response }: HttpContextContract) {
    await request.validate(UpdateValidator);
    const userSecureId = params.id;
    const userAuthenticated = auth.user;

    try {
      if (userSecureId !== userAuthenticated?.secureId)
        throw new Error('You are not authorized to edit this user info');
    } catch (error) {
        return response.forbidden({ message: error.message })
    }

    const requestBody = request.only(["name", "email", "password"]);

    let updatedUser: User;

    try {
      updatedUser = await User.findByOrFail('secure_id', userSecureId);
      await updatedUser.merge(requestBody).save();
    } catch (error) {
      return response.badRequest(error);
    }

    try {
      const user = await User.query().where('email', updatedUser.email).preload('roles').first();
      return response.ok(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findByOrFail('secure_id', params.id);
      await user.delete();
      response.ok({ message: 'User deleted!' });
    } catch (error) {
      response.ok({ message: 'Error deleting user', originalMessage: error.message });
    }
  }
}
