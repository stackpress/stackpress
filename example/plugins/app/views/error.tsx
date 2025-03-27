import '../styles/page.css';
import type { 
  Trace,
  PageBodyProps, 
  PageHeadProps 
} from 'stackpress/view';

//placeholder for translation
const _ = (text: string) => text;

export type Config = {
  server: { mode: string }
}

export default function ErrorPage(props: PageBodyProps<Config>) {
  const {
    data = { server: { mode: 'production' } },
    response
  } = props;

  const mode = data.server?.mode || 'production';
  const production = mode === 'production';
  const notfound = response.code === 404;
  const title = notfound ? _('Not Found') : _('Oops...');
  const description = notfound 
    ? _('The requested resource was not found.') 
    : _(response.error || 'There was an error.');
  const stack = (response.stack || []) as (Trace & { 
    snippet: Record<string, string|undefined> 
  })[];
  return (
    <>
      <h1>{title}</h1>
      <p>
        {description}
      </p>
      {!production && !notfound && stack.length > 0 && (
        <div>
          {stack.map((trace, index) => (
            <div key={index} className="px-mb-20">
              <h3 className="font-bold m-0">
                #{stack.length - Number(index)} {trace.method}
              </h3>
              <div className="font-italic theme-muted text-sm px-pt-10">
                {trace.file}:{trace.line}:{trace.char}
              </div>
              {trace.snippet && (
                <div>
                  {trace.snippet.before && (
                    <pre>{trace.line - 1} | {trace.snippet.before}</pre>
                  )}
                  {trace.snippet.main && (
                    <pre>{trace.line} | {trace.snippet.main}</pre>
                  )}
                  {trace.snippet.location && (
                    <pre>{' '.repeat(String(trace.line).length + 3)}{trace.snippet.location}</pre>
                  )}
                  {trace.snippet.after && (
                    <pre>{trace.line + 1} | {trace.snippet.after}</pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export function Head(props: PageHeadProps<Config>) {
  const {
    request,
    response,
    styles = []
  } = props;

  const notfound = response.code === 404;
  const url = request.url?.pathname || '/';
  const title = notfound ? _('Not Found') : _('Oops...');
  const description = notfound 
    ? _('The requested resource was not found.') 
    : _('There was an error.');
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content="/images/banner.png" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:image" content="/images/banner.png" />

      <link rel="icon" type="image/svg+xml" href="/react.svg" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}