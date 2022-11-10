import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import Cart from "App/Models/Cart";
import Game from "App/Models/Game";
import User from "App/Models/User";

test.group('create bets', (group) => {

    group.tap(test => test.tags(['@bets_store']));

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
      })

    test('return error if not authenticated', async ({ client, route }) => {
        const response = await client
            .post(route('BetsController.store'))
            .json({
                bets: [{
                    gameId: 1,
                    chosenNumbers: [1, 2, 3, 4, 5, 6]
                }]
            });
        response.assertStatus(401);
    })

    test('return error if less than min value', async ({ client, route }) => {
        const user = await User.findBy('email', 'player@email.com') as User;
        const { minValue } = await Cart.query().firstOrFail();
        const betsArray = [{
            gameId: 1,
            chosenNumbers: [1, 2, 3, 4, 5, 6]
        }];
        const prices = await Promise.all(betsArray.map(async bet => {
            const game = await Game.findBy('id', bet.gameId);
            return game?.price as number;
        }));
        const total = prices.reduce((prev, cur) => prev + cur)
        const response = await client
            .post(route('BetsController.store'))
            .json({
                bets: [{
                    gameId: 1,
                    chosenNumbers: [1, 2, 3, 4, 5, 6]
                }]
            }).loginAs(user);
        response.assertStatus(400);
        // response.assertBodyContains({
        //     message: "Min cart value not reached",
        //     minValue: minValue,
        //     currentValue: total
        // })
    })
})