import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Cart from "App/Models/Cart";
import Game from "App/Models/Game";
import StoreValidator from "App/Validators/Game/StoreValidator";
import UpdateValidator from "App/Validators/Game/UpdateValidator";

export default class GamesController {
  public async index({ response }: HttpContextContract) {
    try {
      const games = await Game.all();
      const cart = await Cart.findByOrFail("id", "1");
      if (games.length === 0) {
        return response.notFound({ message: "There are no games to show" });
      }
      return response.ok({
        games: games.sort((a, b) => a.id - b.id),
        min_cart_value: cart.minValue,
      });
    } catch (error) {
      return response.notFound(error.message);
    }
  }

  public async store({ request, bouncer, response }: HttpContextContract) {
    await request.validate(StoreValidator);

    await bouncer.authorize("is adm");

    const gameStoreRequest = request.only([
      "type",
      "description",
      "range",
      "price",
      "min_max_number",
      "color",
    ]);
    try {
      const game = await Game.create(gameStoreRequest);
      return response.created(game);
    } catch (error) {
      return response.badRequest(error.message);
    }
  }

  public async show({ params, response }: HttpContextContract) {
    const gameId = params.id;
    try {
      const game = await Game.findByOrFail("id", gameId);
      return response.ok(game);
    } catch (error) {
      response.notFound(error.message);
    }
  }

  public async update({
    request,
    params,
    bouncer,
    response,
  }: HttpContextContract) {
    await request.validate(UpdateValidator);
    await bouncer.authorize("is adm");

    const gameUpdateRequest = request.only([
      "type",
      "description",
      "range",
      "price",
      "min_max_number",
      "color",
    ]);
    const { color, description, min_max_number, price, range, type } =
      gameUpdateRequest;
    if (
      !color &&
      !description &&
      !min_max_number &&
      !price &&
      !range &&
      !type
    ) {
      return response.badRequest({ message: "No property updated" });
    }
    const gameId = params.id;
    try {
      const game = await Game.findByOrFail("id", gameId);
      const updatedGame = await game.merge(gameUpdateRequest).save();
      return response.ok(updatedGame);
    } catch (error) {
      return response.badRequest(error.message);
    }
  }

  public async destroy({ params, bouncer, response }: HttpContextContract) {
    await bouncer.authorize("is adm");

    const gameId = params.id;
    try {
      const game = await Game.query().where("id", gameId).firstOrFail();
      await game.delete();
      return response.ok({ message: "Game deleted!" });
    } catch (error) {
      if (error.status === 404) {
        return response.notFound({
          message: "Game not found",
          originalMessage: error.message,
        });
      }
      return response.badRequest({
        message: "Error deleting user",
        originalMessage: error.message,
      });
    }
  }
}
