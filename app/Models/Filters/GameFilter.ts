import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Game from '../Game'

export default class GameFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Game, Game>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }

  public type(value: string[]): void {
    this.$query.whereIn('type', value);
  }
}
