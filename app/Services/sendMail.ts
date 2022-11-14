import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";

export async function sendScheduleMail(user: User, template: string) {
    await Mail.send(message => {
        message
            .from('admin@lottery.com')
            .to(user.email)
            .subject("We miss you!")
            .htmlView(template, { user });
    })
}