import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";

test.group('store game', (group) => {

    group.tap(test => test.tags(['@games_store']));

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
      })

    test('require authentication', async ({ client, route }) => {
        const response = await client.post(route('GamesController.store'))
        response.assertStatus(401);
        response.dumpBody();
        response.assertBody({ errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }] });
    });

    test('create new game', async ({ client }) => {
        const user = await User.findBy('email', 'admin@email.com')
        const response = await client
            .post('/games')
            .form({
                type: "Lotomania",
                description: "Escolha 6 números",
                min_max_number: 3,
                range: 15,
                price: 7.50,
                color: "#2ca834"
            })
            .loginAs(user as User);
        response.assertStatus(201);
        response.assertBodyContains(response.body())
    })
})