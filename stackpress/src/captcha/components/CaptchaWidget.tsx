//views
import type { NestedObject } from '../../view/types.js';
import { useServer } from '../../view/server/hooks.js';
//captcha
import MCaptchaWidget from './MCaptchaWidget.js';
import HCaptchaWidget from './HCaptchaWidget.js';

export type CaptchaWidgetProps = {
  //which form is this for?
  form: 'signin' | 'signup';
  //errors related to captcha validation 
  errors: NestedObject<string | string[]>;
};

export default function CaptchaWidget(props: CaptchaWidgetProps) {
  //props
  const { config } = useServer();
  //provider
  const provider = config.path('captcha.provider', 'mcaptcha');
  //hcaptcha
  if (provider === 'hcaptcha') {
    return <HCaptchaWidget {...props} />;
  }
  //mcaptcha (default)
  return <MCaptchaWidget {...props} />;
}
