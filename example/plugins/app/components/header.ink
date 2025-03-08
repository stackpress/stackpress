<script>
  const toggleUserMenu = (e: MouseEvent) => {
    const userMenu = document.getElementById('user-menu');
    if (!userMenu) return;
    userMenu.classList.toggle('none');
  };
</script>
<header class="flex flex-center-y p-10 relative bg-t-0">
  <div class="flex-grow">
    <img src="/images/incept-logo-long.png" height="30" alt="incept logo" />
  </div>
  <element-icon class="tx-4xl" name="user-circle" click=toggleUserMenu />
</header>
<aside id="user-menu" class="none absolute right-0 top-54 bottom-0 w-250">
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
          <a class="tx-info" href="/admin/profile/search">Admin</a>
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