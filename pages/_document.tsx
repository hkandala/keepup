import Document, { Html, Head, Main, NextScript } from "next/document";
import { Analytics } from "@vercel/analytics/react";
import { CssBaseline } from "@geist-ui/core";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <Analytics />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
