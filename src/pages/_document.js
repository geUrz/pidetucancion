import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {

  return (
    <Html lang="es">
      <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
      <body>
        <Main/>
        <NextScript />
      </body>
    </Html>
  );
}
