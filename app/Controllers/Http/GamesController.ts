import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'
import StoreValidator from 'App/Validators/Game/StoreValidator';
import UpdateValidator from 'App/Validators/Game/UpdateValidator';

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    try {
      const games = await Game.all();
      if (games.length === 0) {
        return response.notFound({ message: 'There are no games to show' });
      }
      return response.ok(games.sort((a, b) => a.id - b.id))
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async store({ request, bouncer, response }: HttpContextContract) {
    await request.validate(StoreValidator);

    await bouncer.authorize('is adm');

    const gameStoreRequest = request.only(['type', 'description', 'range', 'price', 'min_max_number', 'color']);
    try {
      const game = await Game.create(gameStoreRequest);
      return response.created(game);
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const gameId = params.id;
    try {
      const game = await Game.findByOrFail('id', gameId);
      return response.ok(game);
    } catch (error) {
      response.notFound(error.message);
    }
  }

  public async update({ request, params, bouncer, response }: HttpContextContract) {
    await request.validate(UpdateValidator);
    await bouncer.authorize('is adm');

    const gameUpdateRequest = request.only(['type', 'description', 'range', 'price', 'min_max_number', 'color']);
    const gameId = params.id;
    try {
      const game = await Game.findByOrFail('id', gameId);
      const updatedGame = await game.merge(gameUpdateRequest).save();
      return response.created(updatedGame);
    } catch (error) {
      return response.badRequest(error.message)
    }
  }

  public async destroy({ params, bouncer, response }: HttpContextContract) {

    await bouncer.authorize('is adm');

    const gameId = params.id;
    try {
      const game = await Game.query().where('id', gameId).firstOrFail();
      await game.delete();
      return response.ok({ message: "Game deleted!" });
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({ message: 'Game not found', originalMessage: error.message });
      }
      return response.badRequest({ message: 'Error deleting user', originalMessage: error.message })
    }
  }
}