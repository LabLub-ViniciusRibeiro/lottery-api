import Mail from "@ioc:Adonis/Addons/Mail";
import Bet from "App/Models/Bet";
import User from "App/Models/User";

export async function sendRecoverPasswordMail(user: User, template: string) {
    await Mail.send(message => {
        message
            .from('admin@lottery.com')
            .to(user.email)
            .subject("Update password")
            .htmlView(template, { user });
    })
}

export async function sendWelcomeMail(user: User, template: string) {
    await Mail.send(message => {
        message
            .from('admin@lottery.com')
            .to(user.email)
            .subject("Welcome to the Lottery App!")
            .htmlView(template, { user });
    })
}

export async function sendNewBetMail(user: User, bets: string, template: string) {
    await Mail.send(message => {
        message
            .from('admin@lottery.com')
            .to(user.email)
            .subject("You have new bets!")
            .htmlView(template, { user, bets });
    })
}