import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User';
import mjml from 'mjml'

export default class RecoverPasswordEmail extends BaseMailer {

  constructor(private user: User, private token: string) {
    super();
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  public html = mjml(View.renderSync('emails/recover', { token: this.token })).html;

  /**
   * The prepare method is invoked automatically when you run
   * "RecoverPassword.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message.subject('Recover password').from('admin@lotteryapp.com').to(this.user.email).html(this.html)
  }
}
