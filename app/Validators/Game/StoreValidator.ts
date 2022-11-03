import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessages'

export default class StoreValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    type: schema.string({ trim: true }, [
      rules.unique({ table: 'games', column: 'type' }), rules.required()]),
    description: schema.string([rules.required()]),
    range: schema.number([
      rules.required(), rules.unsigned()]),
    price: schema.number([
      rules.required(), rules.unsigned()]),
    minMaxNumber: schema.number(
      [rules.required(), rules.unsigned()]),
    color: schema.string([rules.required()])
  })
}
