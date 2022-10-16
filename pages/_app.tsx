import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import 'styles/index.css';

function MyApp({ Component, pageProps: { session, ...pageProps} }: AppProps<{session: Session}>) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default MyApp
