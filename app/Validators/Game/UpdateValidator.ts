import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessages'

export default class UpdateValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public refs = schema.refs({
    id: this.ctx.params.id
  })

  public schema = schema.create({
    type: schema.string.optional({ trim: true }, [
      rules.unique({
        table: 'games', column: 'type', whereNot: {
          id: this.refs.id
        }
      }), rules.required()]),
    description: schema.string.optional([rules.required()]),
    range: schema.number.optional([
      rules.required(), rules.unsigned()]),
    price: schema.number.optional([
      rules.required(), rules.unsigned()]),
    minMaxNumber: schema.number.optional(
      [rules.required(), rules.unsigned()]),
    color: schema.string.optional([rules.required()])
  })
}