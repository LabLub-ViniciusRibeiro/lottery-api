import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bet from 'App/Models/Bet'
import Cart from 'App/Models/Cart';
import Game from 'App/Models/Game';
import User from 'App/Models/User';
import { sendNewBetMail } from 'App/Services/sendMail';


interface IBetsRequest {
  gameId: number,
  chosenNumbers: number[],
}

export default class BetsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const bets = await Bet.query()
        .where('user_id', auth.user?.id as number)
        .preload('game', (game) => game.select(['type', 'color']))
        .preload('user', (user) => user.select(['name', 'email']));
      return response.send(bets)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const { bets }: { bets: IBetsRequest[] } = request.only(['bets']);
    let betsCreated: Bet[]
    try {
      const cart = await Cart.query().select('min_value').first();
      const minCartValue = cart?.minValue;
      const user = await User.findByOrFail('secure_id', auth.user?.secureId);
      const prices = await Promise.all(bets.map(async (bet) => {
        const game = await Game.findByOrFail('id', bet.gameId);
        if (bet.chosenNumbers.length !== game.minMaxNumber) {
          return response
            .badRequest({ message: `For the game ${game.type} you should choose ${game.minMaxNumber} numbers` })
        }

        bet.chosenNumbers.forEach(num => {
          if (num < 1 || num > game.range) {
            return response
              .badRequest({ message: `For the game ${game.type} you should choose numbers between 0 and ${game.range}` })
          }
        })
        return game.price;
      }));
      const totalCart = prices.reduce((previous, current) => (previous as number) + (current as number));
      if (totalCart < (minCartValue as number)) {
        return response.badRequest({ message: "Min cart value not reached", minValue: minCartValue })
      }
      const betsToSave = bets.map(bet => ({
        gameId: bet.gameId,
        userId: user.id,
        chosen_numbers: bet.chosenNumbers.join(', ')
      }));

      betsCreated = await Bet.createMany(betsToSave);
      response.created(betsCreated)

    } catch (error) {
      return response.badRequest({ originalError: error.message });
    }

    try {
      const betsToDisplay = await Promise.all(bets.map(async bet => {
        const game = await Game.findBy('id', bet.gameId);
        return (`|Choosen numbers: ${bet.chosenNumbers}, game: ${game?.type}| `);
      }));
      await sendNewBetMail(auth.user as User, betsToDisplay.join(', '), 'email/newBet');
    } catch (error) {
      response.badRequest({ message: 'Error sending new bets mail', originalMessage: error.message });
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    const userId = auth.user?.id;
    const betSecureId = params.id;
    try {
      const bet = await Bet.query()
        .where('user_id', userId as number)
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
