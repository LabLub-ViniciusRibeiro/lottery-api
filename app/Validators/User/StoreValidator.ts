import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomMessages from '../customMessages'

export default class StoreValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public schema = schema.create({
    name: schema.string({ trim: true }, [rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g)]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email', caseInsensitive: true })
    ]),
    password: schema.string([rules.minLength(4)])
  })
}
