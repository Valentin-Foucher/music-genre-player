import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '@/styles/main.css';
import { ApiClient } from '@/clients/api';

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} apiClient={new ApiClient()} />
    </SessionProvider>
  )
}
