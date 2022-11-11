import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import User from "App/Models/User";
import { UserFactory } from "Database/factories";

test.group('update user', (group) => {

    group.tap(test => test.tags(['@users_update']));

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('return forbidden when user try to update an id different than yours', async ({ client, route }) => {
        const user = await UserFactory.create();
        const response = await client.put(route('UsersController.update', ['1'])).loginAs(user);
        response.assertStatus(403);
        response.assertBodyContains({ message: 'You are not authorized to edit this user info' })
    })

    test('update successfully', async ({ client, route }) => {
        const user = await UserFactory.create();
        const response = await client
            .put(route('UsersController.update', [user.secureId]))
            .json({ email: 'emailtest@email.com' })
            .loginAs(user);
        response.assertStatus(200);
        const userUpdated = await User.query().where('secure_id', user.secureId).preload('roles').first();
        response.assertBodyContains({
            name: userUpdated?.name,
            email: userUpdated?.email,
        })
    })

})