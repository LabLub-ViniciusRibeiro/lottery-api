import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    const uniqueKey = "email";

    await User.updateOrCreateMany(uniqueKey, [
      {
        email: 'admin@email.com',
        name: 'admin',
        password: 'secret',
      },
      {
        email: 'player@email.com',
        name: 'player',
        password: 'secret',
      },])
  }
}
