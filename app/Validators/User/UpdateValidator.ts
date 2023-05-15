import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import CustomMessages from "../customMessages";

export default class UpdateValidator extends CustomMessages {
  constructor(protected ctx: HttpContextContract) {
    super();
  }

  public refs = schema.refs({
    id: this.ctx.auth.user?.secureId,
  });

  public schema = schema.create({
    name: schema.string.optional({ trim: true }, [
      rules.regex(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g),
    ]),
    email: schema.string.optional({}, [
      rules.email(),
      rules.unique({
        table: "users",
        column: "email",
        whereNot: {
          secure_id: this.refs.id,
        },
        caseInsensitive: true,
      }),
    ]),
  });
}
