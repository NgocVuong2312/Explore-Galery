import '@/app/globals.css'; // import file CSS của app
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}   