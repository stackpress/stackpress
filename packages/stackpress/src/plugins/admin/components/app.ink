<link rel="import" type="component" href="@stackpress/ink-ui/element/icon.ink" name="element-icon" />
<link rel="import" type="component" href="@stackpress/ink-ui/element/notify.ink" name="element-notify" />
<script>
  import Cookies from 'js-cookie';

  const { 
    url, 
    code, 
    status,
    errors = {},
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    settings = { 
      root: '/admin',
      name: 'Admin', 
      logo: '/images/logo-square.png',
      menu: []
    }
  } = this.props;
  //states
  const theme = Cookies.get('theme') || 'dark';
  const show = { left: false, right: false };
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
  //this can be accessed by other components like this
  //document.querySelector('panel-layout').toggle('left');
  this.toggle = {
    left: () => {
      show.left = !show.left;
      this.toggle.update.all();
    },
    right: () => {
      show.right = !show.right;
      this.toggle.update.all();
    },
    theme: e => {
      const theme = Cookies.get('theme') || 'dark';
      const target = e.currentTarget;
      const icon = target?.querySelector('i');
      if (theme === 'dark') {
        Cookies.set('theme', 'light');
        this.classList.remove('dark');
        this.classList.add('light');
        icon?.classList.remove('fa-sun');
        icon?.classList.add('fa-moon');
        target?.classList.remove('bg-warning');
        target?.classList.add('bg-t-4');
      } else {
        Cookies.set('theme', 'dark');
        this.classList.remove('light');
        this.classList.add('dark');
        icon?.classList.remove('fa-moon');
        icon?.classList.add('fa-sun');
        target?.classList.remove('bg-t-4');
        target?.classList.add('bg-warning');
      }
    },
    update: {
      all: () => {
        this.toggle.update.main();
        this.toggle.update.head();
        this.toggle.update.left();
        this.toggle.update.right();
      },
      head: () => {
        const { classList } = this.querySelector('header');
        if (show.left) {
          classList.remove('md-left-0');
          classList.add('md-left-226');
        } else {
          classList.remove('md-left-226');
          classList.add('md-left-0');
        }
      },
      left: () => {
        const { classList } = this.querySelector('aside[left]');
        if (show.left) {
          classList.remove('md-left--226');
          classList.add('md-left-0');
        } else {
          classList.remove('md-left-0');
          classList.add('md-left--226');
        }
      },
      right: () => {
        const { classList } = this.querySelector('aside[right]');
        if (show.right) {
          classList.remove('right--200');
          classList.add('right-0');
        } else {
          classList.remove('right-0');
          classList.add('right--200');
        }
      },
      main: () => {
        const { classList } = this.querySelector('main');
        if (show.left) {
          classList.remove('md-left-0');
          classList.add('md-left-226');
        } else {
          classList.remove('md-left-226');
          classList.add('md-left-0');
        }
        if (show.right) {
          classList.remove('lg-right-0');
          classList.add('lg-right-200');
        } else {
          classList.remove('lg-right-200');
          classList.add('lg-right-0');
        }
      }
    }
  };
  //class name logic
  const className = {
    head: [ 
      'absolute', 
      'top-0', 
      'right-0', 
      'h-50', 
      'transition-500',
      'left-226',
      show.left ? 'md-left-226' : 'md-left-0'
    ].join(' '),
    left: [ 
      'w-226', 
      'absolute', 
      'bottom-0', 
      'left-0', 
      'top-0', 
      'transition-500',
      'z-10000',
      show.left ? 'md-left-0' : 'md-left--226'
    ].join(' '),
    right: [ 
      'w-200', 
      'absolute', 
      'transition-500',
      'bottom-0',
      'top-50',
      'z-10000',
      show.right ? 'right-0' : 'right--200'
    ].join(' '),
    main: [ 
      'absolute', 
      'transition-500',
      'top-50',
      'bottom-0',
      'left-226',
      'right-0',
      show.left ? 'md-left-226' : 'md-left-0',
      show.right ? 'lg-right-200' : 'lg-right-0'
    ].join(' ')
  };

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
<header class={className.head}>
  <menu class="h-full flex flex-center-y px-10 m-0 bg-t-2">
    <i 
      class="fas fa-fw fa-bars cursor-pointer py-5 pr-10 none md-inline-block tx-t-1" 
      click={this.toggle.left}
    ></i>
    <nav class="flex-grow"></nav>
    <nav class="flex flex-center-y">
      <a 
        class="cursor-pointer pill bg-warning tx-xl tx-white w-26 h-26 flex flex-center mr-5" 
        click={this.toggle.theme}
      >
        <i class="fas fa-sun" />
      </a>
      <a class="cursor-pointer tx-5xl" click={this.toggle.right}>
        <element-icon name="user-circle" />
      </a>
    </nav>
  </menu>
</header>
<aside left class={className.left}>
  <header class="h-50 px-10 bg-t-1 flex flex-center-y">
    <img class="h-26 mr-10" src={settings.logo} />
    <h3 class="flex-grow tx-upper">{settings.name}</h3>
    <a class="p-10 cursor-pointer none md-inline-block" click={this.toggle.left}>
      <element-icon name="chevron-left" />
    </a>
  </header>
  <main class="bg-t-2 h-calc-full-60">
    <each value=item from={settings.menu}>
      <if true={url.startsWith(item.match)}>
        <a class="flex flex-center-y p-10 tx-t-1 b-t-1 b-solid bb-1 bx-0 bt-0" href={item.path}>
          <element-icon name={item.icon} class="mr-10" />
          {item.name}
        </a>
      <else />
        <a class="flex flex-center-y p-10 tx-primary b-t-1 b-solid bb-1 bx-0 bt-0" href={item.path}>
          <element-icon name={item.icon} class="mr-10 tx-t-1" />
          {item.name}
        </a>
      </if>
    </each>
  </main>
</aside>
<aside right class={className.right}>
  <section class="flex flex-col h-full">
    <header>
      <div class="p-10 bg-t-2 flex flex-center-y" if={!!session?.id}>
        <element-icon class="tx-4xl inline-block mr-5" name="user-circle" />
        <span>{session?.name}</span>
      </div>
      <nav class="p-10 bg-t-3">
        <a class="tx-info tx-sm inline-block p-5 bg-t-0" href="#">EN</a>
        <a class="tx-info tx-sm inline-block p-5 bg-t-0" href="#">TG</a>
      </nav>
    </header>
    <main class="flex-grow bg-t-0">
      <div class="h-full" if={!!session?.id}>
        <nav 
          class="flex flex-center-y px-10 py-15 b-solid b-t-1 bt-0 bx-0 bb-1" 
          if={session?.roles && session.roles.includes('ADMIN')}
        >
          <element-icon class="inline-block mr-5" name="gauge" />
          <a class="tx-info" href={settings.root}>Admin</a>
        </nav>
        <nav class="flex flex-center-y px-10 py-15 b-solid b-t-1 bt-0 bx-0 bb-1">
          <element-icon class="inline-block mr-5" name="power-off" />
          <a class="tx-info" href="/auth/signout">Sign Out</a>
        </nav>
      </div>
      <div class="h-full" if={!session?.id}>
        <nav class="flex flex-center-y px-10 py-15 b-solid b-t-1 bt-0 bx-0 bb-1">
          <element-icon class="inline-block mr-5" name="lock" />
          <a class="tx-info" href="/auth/signin">Sign In</a>
        </nav>
        <nav class="flex flex-center-y px-10 py-15 b-solid b-t-1 bt-0 bx-0 bb-1">
          <element-icon class="inline-block mr-5" name="trophy" />
          <a class="tx-info" href="/auth/signup">Sign Up</a>
        </nav>
      </div>
    </main>
  </section>
</aside>
<main class={className.main} mount=notify>{children}</main>
<element-notify />