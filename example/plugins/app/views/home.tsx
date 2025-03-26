import '../styles/page.css';
import { useState } from 'react';
import { LayoutBlank, HeadProps, BodyProps } from 'stackpress/view';

export function Head(props: HeadProps) {
  const { styles = [] } = props;
  return (
    <>
      <title>Reactus</title>
      <meta name="description" content="Reactus" />
      <link rel="icon" type="image/svg+xml" href="/react.svg" />
      <link rel="stylesheet" type="text/css" href="/styles/global.css" />
      {styles.map((href, index) => (
        <link key={index} rel="stylesheet" type="text/css" href={href} />
      ))}
    </>
  )
}

export default function HomePage(props: BodyProps) {
  const theme = props.request.session.theme as string | undefined;
  const [count, setCount] = useState(0)

  return (
    <LayoutBlank
      theme={theme} 
      brand="Stackpress" 
      base="/"
      logo="https://www.stackpress.io/images/stackpress-logo-icon.png"
    >
      <div className="px-p-10">
        <h1>Welcome to Stackpress</h1>
        <div className="p-4">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
      </div>
    </LayoutBlank>
  )
}