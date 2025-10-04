import type { AppProps } from 'next/app';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import '../app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <NextIntlClientProvider locale="ar" messages={pageProps.messages || {}}>
        <Component {...pageProps} />
      </NextIntlClientProvider>
    </Provider>
  );
}
