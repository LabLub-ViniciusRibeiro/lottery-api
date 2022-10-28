import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Game from 'App/Models/Game'

export default class extends BaseSeeder {
  public async run () {

    const uniqueKey = "type";

    await Game.updateOrCreateMany(uniqueKey, [
      {
        type: "Mega-Sena",
        description: "Escolha 6 números",
        minMaxNumber: 6,
        range: 60,
        price: 5.00,
        color: "#2ca834",
      },
      {
        type: "Lotofácil",
        description: "Escolha 18 números",
        minMaxNumber: 18,
        range: 30,
        price: 10.00,
        color: "#7E5E62"
      },
    ])
  }
}
