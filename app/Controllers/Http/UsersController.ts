import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';
import Role from 'App/Models/Role';
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();
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

    try {
      const user = await User.query().where('email', newUser.email).preload('roles').first();
      return response.created(user)
    } catch (error) {
      await trx.rollback();
      return response.badRequest(error)
    }
  }

  public async show({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
