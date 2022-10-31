import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'

export default class BetsController {
  public async index({ auth, response }: HttpContextContract) {
    const bets = await Bet.query()
      .where('user_id', auth.user?.secureId as string)
      .preload('game');
    return response.send(bets)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const requestBody = request.only(['game_id', 'chosen_numbers']);
    requestBody.chosen_numbers = JSON.stringify(requestBody.chosen_numbers);
    const userSecureId = auth.user?.secureId;

    try {
      const bet = await Bet.create({ userId: userSecureId, ...requestBody });
      return response.created(bet)
    } catch (error) {
      return response.badRequest(error)
    }
  }

  public async show({ auth, request, params, response }: HttpContextContract) {
    const userSecureId = auth.user?.secureId;
    const betSecureId = params.id;
    try {
      const bet = await Bet.query()
        .where('user_id', userSecureId as string)
        .where('secure_id', betSecureId)
        .preload('game')
        .first();

      if (bet === null) {
        throw new Error("This bet doesn't exist or doesn't belog to this user")
      }

      return response.ok(bet)
    } catch (error) {
      console.log(error)
      return response.notFound({ errorMessage: error.message });
    }
  }
}
