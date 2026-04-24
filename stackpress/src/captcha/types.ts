//stackpress
import type { Request, Response } from "../server";

export type CaptchaProvider = 'mcaptcha' | 'hcaptcha';

export type CaptchaEnforceConfig = {
  //enforce on signin?
  signin?: boolean;
  //enforce on signup?
  signup?: boolean;
  //Arbitrary form names (eg. 'contact', 'comment')
  forms?: string[];
};

export type MCaptchaOptions = {
  //script used to embed the widget
  scriptUrl?: string;
};

export type HCaptchaOptions = {
  //script used to embed the widget
  scriptUrl?: string;
  //theme of the widget
  theme?: 'light' | 'dark';
  //size of the widget
  size?: 'normal' | 'compact' | 'invisible';
  //tabindex of the widget
  tabindex?: number;
};

/**
 * Captcha configuration.
 * 
 * Note: never include `secretKey` or `verifyUrl` in the view config
 */
export type CaptchaConfig = {
  //captcha provider.
  provider?: CaptchaProvider;
  //where to enforce captcha
  enforce?: CaptchaEnforceConfig;
  //token field posted back to the server
  tokenField?: string;
  //mCaptcha-only
  widgetUrl?: string;
  //public site key
  siteKey?: string;
  //secret key (never exposed to the client)
  secretKey?: string;
  //verification endpoint (server-only, never exposed to the client)
  verifyUrl?: string;
  //allow bypass captcha verification
  bypass?: boolean;
  //verification timeout in milliseconds
  timeoutMs?: number;
  //provider-specific options
  options?: (MCaptchaOptions | HCaptchaOptions) & Record<string, any>;
};

export type CaptchaPlugin = {
  verify(req: Request, res: Response, form: string): Promise<boolean>;
};
