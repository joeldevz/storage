import { config } from 'dotenv';
config();
export const CONFIG = {
  jwt: {
    secret: process.env.JWT_SECRET,
    privateKey: process.env.JWT_PRIVATE_KEY,
    publicKey: process.env.JWT_PUBLIC_KEY,
  },
};
