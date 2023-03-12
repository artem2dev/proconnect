// // import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
// import { join } from 'path';
// import { config } from './app.config';

// const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = config;

// export const MailerConfig = {
//   transport: {
//     host: MAIL_HOST,
//     port: MAIL_PORT,
//     auth: {
//       user: MAIL_USER,
//       pass: MAIL_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//     secure: true,
//   },
//   template: {
//     dir: join(__dirname, '..', 'assets', 'templates'),
//     // adapter: new PugAdapter(),
//     options: {
//       strict: true,
//     },
//   },
// };

// export default MailerConfig;
