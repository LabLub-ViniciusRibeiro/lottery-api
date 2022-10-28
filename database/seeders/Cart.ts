import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Cart from 'App/Models/Cart'

export default class extends BaseSeeder {
  public async run() {
    
    const searchPayload = { id: 1 }

    await Cart.firstOrCreate(searchPayload, {
      id: 1,
      minValue: 20
    })
  }
}
