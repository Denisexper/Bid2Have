import 'dotenv/config';

export const env = {
  port: process.env.PORT ?? '3000',
  databaseUrl: process.env.DATABASE_URL ?? '',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  auctionCloseCronExpression: process.env.AUCTION_CLOSE_CRON ?? '* * * * *',
};
