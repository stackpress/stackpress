//modules
import { useEffect } from 'react';
import FieldControl from 'frui/form/FieldControl';
//views
import type { NestedObject } from '../../view/types.js';
import { useServer } from '../../view/server/hooks.js';
//captcha
import { CaptchaEnforceConfig } from '../types.js';

export type HCaptchaWidgetProps = {
  //which form is this for?
  form: 'signin' | 'signup';
  //errors related to captcha validation
  errors: NestedObject<string | string[]>;
};

export default function HCaptchaWidget(props: HCaptchaWidgetProps) {
  //props
  const { form, errors } = props;
  const { config } = useServer();
  //captcha
  const enforce = config.path<CaptchaEnforceConfig>('captcha.enforce', {});
  const enforced = form === 'signin' ? enforce.signin : enforce.signup;

  const siteKey = config.path('captcha.siteKey');
  const tokenField = config.path('captcha.tokenField', 'h-captcha-response');

  //options
  const scriptUrl = config.path(
    'captcha.options.scriptUrl',
    'https://js.hcaptcha.com/1/api.js'
  );
  const theme = config.path('captcha.options.theme');
  const size = config.path('captcha.options.size');
  const tabindex = config.path('captcha.options.tabindex');

  //Don't render if captcha isn't enforced for this form, or missing 
  // siteKey.
  if (!enforced || !siteKey) return null;

  //load the api script after render
  useEffect(() => {
    if (!scriptUrl) return;
    const id = 'hcaptcha-api';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, [scriptUrl]);

  //capture any error related to the captcha token field
  const error = errors[tokenField] as string | undefined;

  //render
  return (
    <FieldControl error={error} className="control">
      {/*
        hCaptcha auto-injects/uses a hidden field named `h-captcha-response`
        inside the form.
      */}
      <div
        className="h-captcha"
        data-sitekey={siteKey}
        data-theme={theme}
        data-size={size}
        data-tabindex={typeof tabindex === 'number' ? String(tabindex) : undefined}
      />
    </FieldControl>
  );
}
