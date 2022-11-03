import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, beforeSave, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import { v4 as uuidv4 } from 'uuid'
import Bet from './Bet'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public secureId: string

  @column({ serializeAs: null })
  public rememberMeToken?: string | null

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Bet)
  public bets: HasMany<typeof Bet>

  @manyToMany(() => Role, {
    pivotTable: 'user_roles'
  })
  public roles: ManyToMany<typeof Role>

  @beforeCreate()
  public static assignUuid(user: User) {
    user.secureId = uuidv4()
  }

  @beforeSave()
  public static async hash(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
