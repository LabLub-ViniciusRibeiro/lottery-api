import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessages'

export default class BetValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    bets: schema.array().members(schema.object().members({
      gameId: schema.number([rules.required()]),
      chosenNumbers: schema.array([rules.required()]).members(schema.number())
    }))
  })
}
