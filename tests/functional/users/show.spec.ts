import Database from "@ioc:Adonis/Lucid/Database";
import { test } from "@japa/runner";
import { UserFactory } from "Database/factories";

test.group('show user', (group) => {

    group.tap(test => test.tags(['@users_show']));

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
      })

      test('return forbidden when user try to updade an id different than yours', async ({ client, route }) => {
        const user = await UserFactory.create();
        const response = await client.put(route('UsersController.show', ['1'])).loginAs(user);
        response.assertStatus(403);
        response.assertBodyContains({ message: 'You are not authorized to see this user info' })
    })

})