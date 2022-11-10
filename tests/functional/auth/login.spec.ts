import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";

test.group('login user', (group) => {

    group.tap(test => test.tags(['@auth_login']));

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
      })

    test('require email', async ({ client, route }) => {
        const response = await client
            .post(route('AuthController.login'))
            .form({ password: 'test' });

        response.assertStatus(400);
        response.assertBody({
            errors: [{
                field: 'email',
                message: 'email field is required',
                rule: 'required'
            }]
        })
    })

    test('require password', async ({ client, route }) => {
        const response = await client
            .post(route('AuthController.login'))
            .form({ email: 'test@email.com' });

        response.assertStatus(400);
        response.assertBody({
            errors: [{
                field: 'password',
                message: 'password field is required',
                rule: 'required'
            }]
        })
    })

    test("authentication failed because user doesn't exist", async ({ client, route }) => {
        const response = await client
            .post(route('AuthController.login'))
            .form({ email: 'test@email.com', password: 'test2' });
        response.assertStatus(403);
    })

    test('login user successfully', async ({ client, route }) => {
        const response = await client
            .post(route('AuthController.login'))
            .json({ email: 'admin@email.com', password: 'secret' });
        
        response.assertStatus(200);
        response.assertBodyContains(response.body());
    })
})