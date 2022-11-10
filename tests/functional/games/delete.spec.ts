import { test } from "@japa/runner";
import User from "App/Models/User";
import { GameFactory } from "Database/factories";

test.group('delete game', () => {
    test('user not authenticated', async ({ client }) => {
        const response = await client.delete('/games/1');
        response.assertStatus(401)
        response.assertBodyContains({
            "errors": [
                {
                    "message": "E_UNAUTHORIZED_ACCESS: Unauthorized access"
                }
            ]
        })
    })

    test("user doesn't have access", async ({ client }) => {
        const response = await client.delete('/games/1');
        response.assertStatus(401)
    })

    test("game not found", async ({ client }) => {
        const user = await User.findBy('email', 'admin@email.com');
        const response = await client.delete('/games/1').loginAs(user as User);
        response.assertStatus(404)
    })

    test('delete game successfully', async ({ client }) => {
        const user = await User.findBy('email', 'admin@email.com');
        const game = await GameFactory.create();
        const response = await client.delete(`/games/${game.id}`).loginAs(user as User);
        response.assertStatus(200);
        response.assertBody(response.body());
    })
})