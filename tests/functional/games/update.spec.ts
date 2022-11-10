import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";
import { GameFactory, UserFactory } from "Database/factories";

test.group('game update', (group) => {

    group.tap(test => test.tags(['@games_update']));

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
      })

    test('user not authenticated', async ({ client }) => {
        const user = await UserFactory.create();
        const game = await UserFactory.create();
        const response = await client.put(`games/${game.id}`).loginAs(user);
        response.assertStatus(403)
        response.assertBodyContains({
            message: 'E_AUTHORIZATION_FAILURE: Not authorized to perform this action'
        })
    })

    test('bad formated request', async ({ client }) => {
        const user = await User.findBy('email', 'admin@email.com') as User;
        const game = await UserFactory.create();
        const response = await client.put(`games/${game.id}`).loginAs(user).form({ typee: '' })
        response.assertStatus(400)
        response.assertBody({ message: 'No property updated' });
    })

    test('update successfully', async ({ client }) => {
        const user = await User.findBy('email', 'admin@email.com') as User;
        const game = await GameFactory.create();
        const response = await client.put(`games/${game.id}`).loginAs(user).form({ type: 'New Type' })
        response.assertStatus(200)
        response.assertBodyContains(response.body());
    })
})