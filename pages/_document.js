import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Montserrat:wght@100;300;400;500;600;700&family=Nunito+Sans:opsz@6..12&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://assets.complycube.com/web-sdk/v1/style.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
