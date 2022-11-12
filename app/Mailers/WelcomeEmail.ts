import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User';
import mjml from 'mjml'

export default class WelcomeEmail extends BaseMailer {

  constructor(private user: User) {
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

  /**
   * The prepare method is invoked automatically when you run
   * "WelcomeEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */

  public html = mjml(View.renderSync('emails/welcome', { name: this.user.name, email: this.user.email })).html;

  public prepare(message: MessageContract) {
    message
      .subject('Welcome to Lottery App!')
      .from('admin@lotteryapp.com')
      .to(this.user.email)
      .html(this.html as any)
  }
}
