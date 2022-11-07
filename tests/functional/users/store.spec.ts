import { test } from "@japa/runner";

test.group('store user', () => {
    test('require name', async ({ client, route }) => {
        const response = await client.post(route('UsersController.store')).form({ email: 'test@email.com', password: 'test' });
        response.assertStatus(422);
        response.assertBody({
            errors: [{
                rule: 'required',
                field: 'name',
                message: 'name field is required'
            }]
        })
    })

    test('require email', async ({ client, route }) => {
        const response = await client
            .post(route('UsersController.store'))
            .form({ name: 'Test', password: 'test' });
        response.assertStatus(422);
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
            .post(route('UsersController.store'))
            .form({ email: 'test@email.com', name: 'Test' });
        response.assertStatus(422);
        response.assertBody({
            errors: [{
                field: 'password',
                message: 'password field is required',
                rule: 'required'
            }]
        })
    })
})