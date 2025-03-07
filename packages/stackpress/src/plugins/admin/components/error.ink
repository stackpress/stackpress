<link rel="import" type="template" href="@stackpress/incept-admin/dist/components/head.ink" name="html-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table.ink" name="table-layout" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/head.ink" name="table-head" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/row.ink" name="table-row" />
<link rel="import" type="component" href="@stackpress/ink-ui/layout/table/col.ink" name="table-col" />
<link rel="import" type="component" href="@stackpress/incept-admin/dist/components/app.ink" name="admin-app" />
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
    code = 200, 
    status = 'OK', 
    stack = [],
    settings = { menu: [] }
  } = props('document');

  const url = '/';
  const title = _('Oops! Something went wrong.');

  if (Array.isArray(stack)) {
    stack.forEach(trace => {
      const { source, line, char } = trace;
      if (!source) return;
      const lines = source.split('\n');
      const snippet: Record<string, string|undefined> = {
        before: lines[line - 2] || undefined,
        main: lines[line - 1] || undefined,
        after: lines[line] || undefined,
      };
      //if location doesnt match main line
      if (snippet.main && snippet.main.length >= char) {
        snippet.location = ' '.repeat(Math.max(char - 1, 0)) + '^';
      }

      trace.snippet = snippet;
    });
  }
</script>
<html>
  <html-head />
  <body class="relative dark bg-t-0 tx-t-1 tx-arial">
    <admin-app {settings} {url} {title} code={200}>
      <main class="flex-grow p-10 scroll-auto h-calc-full-38">
        <h1>{title}</h1>
        <div class="bg-t-4 courier tx-lh-22 tx-word-wrap p-10 mt-10 scroll-x-auto">
          {status}
        </div>
        <if true={stack.length}>
          <table-layout 
            class="w-full mt-20"
            top
            head="py-16 px-12 bg-t-2 b-solid b-black bt-1 bb-0 bx-0 tx-upper tx-bold" 
            body="py-16 px-12 b-solid b-black bt-1 bb-0 bx-0" 
            odd="bg-t-1"
            even="bg-t-2"
          >
            <each key=index value=trace from=stack>
              <table-row>
                <table-col nowrap>
                  <span class="tx-bold tx-sm">
                    #{stack.length - index}
                  </span>
                  <h3 class="tx-normal">{trace.method}</h3>
                  <p class="tx-sm tx-muted">{trace.file}:{trace.line}:{trace.char}</p>
                  <if true={trace.snippet}>
                    <div class="mt-10 py-5 px-10 tx-lh-8 bg-h-111111 tx-h-EEEEEE">
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
                    </div>
                  </if>
                </table-col>
              </table-row>
            </each>
          </table-layout>
        </if>
      </main>
    </admin-app>
  </body>
</html>