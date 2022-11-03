import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { v4 as uuidv4 } from 'uuid'
import Game from './Game'

export default class Bet extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

  @column()
  public userId: number

  @column()
  public gameId: number

  @column()
  public chosenNumbers: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Game)
  public game: BelongsTo<typeof Game>

  @beforeCreate()
  public static defineUUID(bet: Bet) {
    bet.secureId = uuidv4()
  }

}
