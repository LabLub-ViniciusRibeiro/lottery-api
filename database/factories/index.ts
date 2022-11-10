import Factory from '@ioc:Adonis/Lucid/Factory'
import Bet from 'App/Models/Bet'
import Game from 'App/Models/Game'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
    return ({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    })
}).build()

export const GameFactory = Factory.define(Game, ({ faker }) => {
    return ({
        type: faker.name.jobTitle(),
        description: faker.name.jobDescriptor(),
        min_max_number: faker.random.numeric(2),
        range: Number(faker.random.numeric(2)),
        price: Number(faker.random.numeric(2)),
        color: faker.color.rgb()
    })
}).build()

// export const BetFactory = Factory.define(Bet, ({ faker }) => {
//     const games = 
//     return ({
//         gameId: 1,
//         chosenNumbers: 
//     })
// })
