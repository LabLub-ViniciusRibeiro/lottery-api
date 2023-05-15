import Route from "@ioc:Adonis/Core/Route";
import Database from "@ioc:Adonis/Lucid/Database";

Route.get("/test-health", async ({ response }) => {
  const health = await Database.report();
  const { message } = health.health;

  return response.send({ message: message });
});

Route.get("/test-auth", ({ response }) => {
  try {
    response.ok({ message: "you are authenticated!" });
  } catch (error) {
    response.forbidden({ message: "you don't have the credentials" });
  }
}).middleware("auth");

// public routes
Route.group(() => {
  Route.post("/login", "AuthController.login");
  Route.post("/users", "UsersController.store");
  Route.post(
    "/recover_password",
    "AuthController.generateRecoverPasswordToken"
  );
  Route.patch("/recover_password/:token", "AuthController.recoverPassword");
  Route.resource("/games", "GamesController").only(["index", "show"]).apiOnly();
});

// authenticated routes
Route.group(() => {
  Route.resource("/users", "UsersController")
    .except(["store", "update"])
    .apiOnly();
  Route.put("/users", "UsersController.changeUser");
  Route.resource("/bets", "BetsController")
    .only(["index", "store", "show"])
    .apiOnly();
  Route.resource("/games", "GamesController")
    .except(["index", "show"])
    .apiOnly();
}).middleware("auth");
