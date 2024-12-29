import type { AppProps } from 'next/app';
import '../messagechannel-polyfill';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;


