import { test } from "@japa/runner";
import Game from "App/Models/Game";
import { GameFactory } from "Database/factories";


test.group('list games', () => {

    test('return no games', async ({ client }) => {
        const response = await client.get('/games');
        response.assertStatus(404);
        response.assertBody({ message: 'There are no games to show' })
    })

    test('list all games', async ({ client, assert }) => {
        await GameFactory.createMany(10);
        const response = await client.get('games');

        const games = await Game.query().limit(0).orderBy('id', 'asc');

        response.assertStatus(200);
        assert.containsSubset(response.body(), games.map(row => row.toJSON()));
    })
})