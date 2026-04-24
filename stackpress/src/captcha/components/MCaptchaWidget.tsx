//modules
import { useEffect } from 'react';
import FieldControl from 'frui/form/FieldControl';
//views
import type { NestedObject } from '../../view/types.js';
import { useServer } from '../../view/server/hooks.js';
import { CaptchaEnforceConfig } from '../types.js';

export type MCaptchaWidgetProps = {
  //which form is this for?
  form: 'signin' | 'signup';
  //errors related to captcha validation
  errors: NestedObject<string | string[]>;
};

export default function MCaptchaWidget(props: MCaptchaWidgetProps) {
  //props
  const { form, errors } = props;
  const { config } = useServer();
  //captcha
  const enforce = config.path<CaptchaEnforceConfig>('captcha.enforce', {});
  const enforced = form === 'signin' ? enforce.signin : enforce.signup;

  const scriptUrl = config.path(
    'captcha.options.scriptUrl',
    'https://unpkg.com/@mcaptcha/vanilla-glue@0.1.0-rc2/dist/index.js',
  );
  const tokenField = config.path('captcha.tokenField', 'mcaptcha__token');
  const widgetUrl = config.path('captcha.widgetUrl');

  //Don't render if captcha isn't enforced for this form, or missing
  // widgetUrl.
  if (!enforced || !widgetUrl) return null;

  //load the script after render
  useEffect(() => {
    if (!scriptUrl) return;
    const id = 'mcaptcha-vanilla-glue';
    //already loaded
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = scriptUrl;
    script.defer = true;
    document.body.appendChild(script);
  }, [scriptUrl]);

  //capture any error related to the captcha token field
  const error = errors[tokenField] as string | undefined;
  
  //render
  return (
    <FieldControl error={error} className="control">
      {/*
        mCaptcha's vanilla-glue expects fixed element ids:
        - mcaptcha__token
        - mcaptcha__widget-container
      */}
      <label
        data-mcaptcha_url={widgetUrl}
        htmlFor="mcaptcha__token"
        id="mcaptcha__token-label"
      >
        <input
          type="text"
          // field name controls what is POSTed to the server
          name={tokenField}
          // id is fixed for vanilla glue
          id="mcaptcha__token"
          className="field"
          aria-invalid={error ? 'true' : 'false'}
          required
        />
      </label>
      <div id="mcaptcha__widget-container"></div>
    </FieldControl>
  );
}
