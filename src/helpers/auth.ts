import { config } from 'src/config/app.config';

const { REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS } = config;

export function getRefreshExpiresIn(): Date {
  const expiresIn = new Date();

  expiresIn.setTime(+expiresIn + REFRESH_TOKEN_EXPIRES_DAYS_IN_MILLISECONDS);

  return expiresIn;
}
