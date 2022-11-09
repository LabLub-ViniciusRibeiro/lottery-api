import { test } from "@japa/runner";
import Game from "App/Models/Game";
import { GameFactory } from "Database/factories";


test.group('list games', () => {

    test('return no games', async ({ client }) => {
        try {
            const games = await Game.all();
            games.forEach(async game => await game.delete());
        } catch (error) {}

        try {
            const response = await client.get('/games');
            response.assertStatus(404);
            response.assertBody({ message: 'There are no games to show' })
        } catch (error) {}

    })

    test('list all games', async ({ client, assert }) => {
        await GameFactory.createMany(10);
        const response = await client.get('games');

        const games = await Game.query().limit(0).orderBy('id', 'asc');

        response.assertStatus(200);
        assert.containsSubset(response.body(), games.map(row => row.toJSON()));
    })
})