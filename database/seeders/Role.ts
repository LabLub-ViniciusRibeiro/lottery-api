import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role';

export default class extends BaseSeeder {

  public async run() {
    
    const uniqueKey = 'id';

    await Role.updateOrCreateMany(uniqueKey, [
      {
        id: 1,
        name: 'admin'
      },
      {
        id: 2,
        name: 'player'
      }])

  }
}
