import cron from 'node-cron';
import { env } from '../config/env';
import { CloseExpiredAuctionsUseCase } from '../../application/use-cases/listing/CloseExpiredAuctionsUseCase';

export function scheduleAuctionCloseJob(useCase: CloseExpiredAuctionsUseCase): void {
  cron.schedule(env.auctionCloseCronExpression, async () => {
    try {
      const closed = await useCase.execute();
      if (closed.length > 0) {
        console.log(`[auction-close] closed ${closed.length} expired auction(s)`);
      }
    } catch (error) {
      console.error('[auction-close] failed to close expired auctions', error);
    }
  });
}
