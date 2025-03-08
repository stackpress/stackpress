<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/notify.ink" name="element-notify" />
<script>
  import Cookies from 'js-cookie';

  const { code, status, errors = {} } = this.props;
  //states
  const theme = Cookies.get('theme') || 'dark';
  const children = this.originalChildren;
  //initial setup
  this.classList.add(
    'block', 
    'relative', 
    'w-full', 
    'vh', 
    'scroll-hidden',
    theme, 
    'bg-t-0', 
    'tx-t-1', 
    'tx-arial'
  );

  const notify = () => {
    //get notifier
    const notifier = document.querySelector('element-notify');
    //check if notifier exists
    if (!notifier) return;
    //check if there are errors
    if (Object.keys(errors).length > 0) {
      for (const key in errors) {
        if (typeof errors[key] === 'string') {
          notifier.notify('error', errors[key]);
        }
      }
    } else if (code !== 200) {
      notifier.notify('error', status);
    }
  };
</script>
<main mount=notify>{children}</main>
<element-notify />