import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game'

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    try {
      const games = await Game.all();
      return response.ok(games)
    } catch (error) {
      return response.notFound(error.message)
    }
  }

  public async store({ request, response }: HttpContextContract) {
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

  public async update({ request, params, response }: HttpContextContract) {
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

  public async destroy({ params, response }: HttpContextContract) {
    const gameId = params.id;
    try {
      await Game.query().where('id', gameId).delete();
      return response.ok({ message: "Game deleted!" });
    } catch (error) {
      return response.badRequest({ message: 'Error deleting user', originalMessage: error.message })
    }
  }
}
