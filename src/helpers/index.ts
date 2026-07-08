import { randomInt } from 'crypto';

export const generateOtp = (): string => {
  return randomInt(100000, 999999).toString();
};

export const getExpirationTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000);
};
