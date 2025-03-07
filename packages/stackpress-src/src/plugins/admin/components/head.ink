<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <link rel="favicon" href="/favicon.ico" />
  <link rel="shortcut icon" type="image/png" href="/favicon.png" />
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
  <link rel="stylesheet" type="text/css" href="/styles/global.css" />
  <link rel="stylesheet" type="text/css" href={`/client/${env('BUILD_ID')}.css`} />
  
  <script data-template type="application/json">__TEMPLATE_DATA__</script>
  <script type="text/javascript" src={`/client/${env('BUILD_ID')}.js`}></script>
  <if true={env('PUBLIC_ENV') !== 'production'}>
    <script src="/dev.js"></script>
  </if>
</head>