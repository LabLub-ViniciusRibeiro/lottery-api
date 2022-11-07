import { test } from "@japa/runner";
import User from "App/Models/User";

test.group('store game', () => {
    test('require authentication', async ({ client, route }) => {
        const response = await client.post(route('GamesController.store'))
        response.assertStatus(401);
        response.dumpBody();
        response.assertBody({ errors: [{ message: 'E_UNAUTHORIZED_ACCESS: Unauthorized access' }] });
    });

    // test('require type', async ({ client }) => {
    //     const user = await User.findBy('email', 'admin@email.com');
    //     const result = await client.post('/games').loginAs(user as User);
    //     result.dumpBody();
    // })
})