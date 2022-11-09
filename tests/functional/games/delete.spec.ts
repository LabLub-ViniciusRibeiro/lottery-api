import { test } from "@japa/runner";
import User from "App/Models/User";

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
        await client.delete('/games/1').loginAs(user as User);
        const response = await client.delete('/games/1');
        response.dumpBody()
        response.assertStatus(404)
    })
})