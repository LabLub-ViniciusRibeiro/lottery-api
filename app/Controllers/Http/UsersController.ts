import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Role from 'App/Models/Role';
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.query().preload('roles', roles => roles.select('name'));
      return response.ok(users)
    } catch (error) {
      return response.notFound({ error })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const requestBody = request.only(["name", "email", "password"]);

    const trx = await Database.beginGlobalTransaction();

    let newUser: User;
    try {
      newUser = await User.create(requestBody, trx);
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }

    try {
      const player = await Role.findBy('name', 'player', trx)
      if (player === null) throw new Error();
      if (player) newUser.related('roles').attach([player.id])
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }

    try {
      const user = await User.query().where('email', newUser.email).preload('roles').first();
      return response.created(user)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({ params, response }: HttpContextContract) {
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

  public async update({ request, params, response }: HttpContextContract) {
    const userSecureId = params.id;
    const requestBody = request.only(["name", "email", "password"]);
    const trx = await Database.beginGlobalTransaction();

    let updatedUser: User;
    try {
      updatedUser = await User.findByOrFail('secure_id', userSecureId);
      updatedUser.useTransaction(trx);
      response.send(updatedUser)
      await updatedUser.merge(requestBody).save();
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error);
    }

    try {
      const user = await User.query().where('email', updatedUser.email).preload('roles').first();
      trx.commit();
      return response.ok(user)
    } catch (error) {
      await trx.rollback();
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
