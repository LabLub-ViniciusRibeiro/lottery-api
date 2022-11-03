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
      })]),
    description: schema.string.optional(),
    range: schema.number.optional([
      rules.unsigned()]),
    price: schema.number.optional([
      rules.unsigned()]),
    min_max_number: schema.number.optional(
      [rules.unsigned()]),
    color: schema.string.optional()
  })
}