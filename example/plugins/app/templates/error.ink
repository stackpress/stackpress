<link rel="import" type="template" href="@/plugins/app/components/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/panel.ink" name="panel-layout" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table.ink" name="table-layout" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/head.ink" name="table-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/row.ink" name="table-row" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/col.ink" name="table-col" />
<style>
  @ink theme;
  @ink reset;
  @ink fouc-opacity;
  @ink utilities;
</style>
<script>
  import { env, props } from '@stackpress/ink';
  import { _ } from '@stackpress/incept-i18n';

  const {
    config = {},
    session = { 
      id: 0, 
      token: '', 
      roles: [ 'GUEST' ], 
      permissions: [] 
    },
    request = {},
    response = {}
  } = props('document');

  const {
    error,
    code = 200,
    status = 'OK', 
    stack = []
  } = response;

  const mode = config.server?.mode || 'production';
  const development = mode !== 'production';
  const notfound = code === 404;

  const url = request.url?.pathname || '/';
  const title = notfound ? _('Not Found') : _('Oops...');
  const description = notfound 
    ? _('The requested resource was not found.') 
    : _('There was an error.');
</script>
<html>
  <html-head />
  <body class="dark bg-t-0 tx-t-1 tx-arial">
    <div class="p-20 w-calc-full-40">
      <h1 class="pt-10 pb-20">{title}</h1>
      <p>{description}</p>
      <if true={!notfound}>
        <div class="bg-t-4 courier tx-lh-22 tx-word-wrap px-10 py-20 scroll-x-auto mt-20 tx-bold tx-2xl">
          {error || status}
        </div>
      </if>
      <if true={!notfound && development && stack.length}>
        <h3 class="mt-60 tx-upper tx-lg">{_('Stack Trace:')}</h3>
        <table-layout 
          class="w-full mt-20"
          top
          head="py-16 px-12 bg-t-2 b-solid b-black bt-1 bb-0 bx-0 tx-upper tx-bold" 
          body="py-16 px-12 b-solid b-black bt-1 bb-0 bx-0" 
          odd="bg-t-1"
          even="bg-black tx-white"
        >
          <each key=index value=trace from=stack>
            <table-row>
              <table-col nowrap>
                <div class="tx-bold">#{stack.length - Number(index)} {trace.method}</div>
                <div class="tx-italic tx-muted tx-md pt-10">
                  {trace.file}:{trace.line}:{trace.char}
                </div>
              </table-col>
            </table-row>
            <if true={trace.snippet?.main}>
              <table-row>
                <table-col class="tx-lh-8 bg-black tx-white">
                  <if true={trace.snippet.before}>
                    <pre>{trace.line - 1} | {trace.snippet.before}</pre>
                  </if>
                  <if true={trace.snippet.main}>
                    <pre>{trace.line} | {trace.snippet.main}</pre>
                  </if>
                  <if true={trace.snippet.location}>
                    <pre>{' '.repeat(String(trace.line).length + 3)}{trace.snippet.location}</pre>
                  </if>
                  <if true={trace.snippet.after}>
                    <pre>{trace.line + 1} | {trace.snippet.after}</pre>
                  </if>
                </table-col>
              </table-row>
            </if>
          </each>
        </table-layout>
      </if>
    </div>
  </body>
</html>