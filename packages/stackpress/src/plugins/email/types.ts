import type { TransportOptions } from 'nodemailer';
import type { Options as JSONOptions } from 'nodemailer/lib/json-transport';
import type { Options as MailOptions } from 'nodemailer/lib/sendmail-transport';
import type { Options as SESOptions } from 'nodemailer/lib/ses-transport';
import type { Options as PoolOptions } from 'nodemailer/lib/smtp-pool';
import type { Options as SMTPOptions } from 'nodemailer/lib/smtp-transport';
import type { Options as StreamOptions } from 'nodemailer/lib/stream-transport';

export type EmailConfig = { 
  email: TransportOptions
    | JSONOptions
    | MailOptions
    | SESOptions
    | PoolOptions
    | SMTPOptions
    | StreamOptions
    | string 
};