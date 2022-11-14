import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View';
import User from 'App/Models/User';
import mjml from 'mjml'

export default class BetsCreatedEmail extends BaseMailer {

  constructor(private user: User, private bets: string) {
    super()
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
   * "BetsCreatedEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public html = mjml(View.renderSync('emails/newBet', { bets: this.bets })).html;

  public prepare(message: MessageContract) {
    message
      .subject('You have new bets!')
      .from('admin@lotteryapp.com')
      .to(this.user.email)
      .html(this.html as any)
  }
}
