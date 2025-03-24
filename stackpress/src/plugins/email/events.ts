//modules
import type { SendMailOptions, SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';
//stackpress
import { server } from '@stackpress/ingest/Server';
//root
import type { EmailConfig } from '../../types';

const emitter = server();

emitter.on('email-send', async function EmailSend(req, res, ctx) {
  //if there is a response body or there is an error code
  if (res.body || (res.code && res.code !== 200)) {
    //let the response pass through
    return;
  }
  const config = ctx.config<EmailConfig>('email');
  if (!config) return;
  const options = req.data<SendMailOptions>();
  const transporter = nodemailer.createTransport(config);
  const info = await new Promise<SentMessageInfo>((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
  res.setResults(info);
});

export default emitter;