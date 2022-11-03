import { BaseTask } from 'adonis5-scheduler/build'
import User from 'App/Models/User'
import Bet from 'App/Models/Bet'
import { sendScheduleMail } from 'App/Services/sendMail'
import Logger from '@ioc:Adonis/Core/Logger'

export default class VerifyTimeSinceLastBet extends BaseTask {
	public static get schedule() {
		return '0 9 * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
		try {
			const users = await User.all();
			const today = new Date();
			const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
			users.forEach(async user => {
				const bets: Bet[] = await user.related('bets').query();
				const createdDates = bets.map(bet => new Date(bet.createdAt?.year, bet.createdAt?.month - 1, bet.createdAt?.day));
				const hasLessThanOneWeek = createdDates.find(date => date > oneWeekAgo)
				if (!hasLessThanOneWeek) {
					await sendScheduleMail(user, 'email/scheduler');
				}
			})
		} catch (error) {
			Logger.info('some problem ocurred');
		}
	}
}
