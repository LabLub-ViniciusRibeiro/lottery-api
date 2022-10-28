/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'

Route.get('/test-health', async ({ response }) => {
  const health = await Database.report();
  const { message } = health.health;

  return response.send({ message: message });
});

Route.get('/test-auth', ({ response }) => {
  try {
    response.ok({ message: "you are authenticated!" })
  } catch (error) {
    response.forbidden({ message: "you don't have the credentials" })
  }
}).middleware('auth');

// public routes
Route.group(() => {
  Route.post('/login', 'AuthController.login');
  Route.post('/users', 'UsersController.store');
})

// authenticated routes
Route.group(() => {
  Route.resource('/users', 'UsersController').except(['store']);
}).middleware('auth')