import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    const searchKeyAdmin = { email: 'admin@email.com' };

    const userAdmin = await User.updateOrCreate(searchKeyAdmin,
      {
        email: 'admin@email.com',
        name: 'admin',
        password: 'secret',
      });

    const roleAdmin = await Role.findBy('name', 'admin');
    if (roleAdmin) await userAdmin.related('roles').attach([roleAdmin.id]);
    
    const searchKeyPlayer = { email: 'player@email.com' };
    
    const userPlayer = await User.updateOrCreate(searchKeyPlayer,
      {
        email: 'player@email.com',
        name: 'player',
        password: 'secret'
      });
      
      const rolePlayer = await Role.findBy('name', 'player');
      if (rolePlayer) await userPlayer.related('roles').attach([rolePlayer.id]);
      
  }
}
