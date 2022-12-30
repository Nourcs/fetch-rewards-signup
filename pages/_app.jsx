import React, { useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import AppContext from '../context/state';
import '../styles/globals.css';
import { CookiesProvider, useCookies } from 'react-cookie';
import { isEmpty } from 'lodash';

export default function App({ Component, pageProps }) {
  // Listen to User Change
  const [user, setUser] = useState(null);
  const [cookies, setCookie] = useCookies(['user']);

  useEffect(() => {
    onAuthStateChanged(auth, (result) => {
      if (result) {
        const {
          displayName, email,
        } = result;
        setUser({
          displayName, email,
        });
      } else {
        setUser(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(cookies.user)) {
      setUser(cookies.user);
    }
  }, [cookies]);

  return (
    <div className="bg-dark-100">
      <AppContext.Provider value={{
        user, setUser,
      }}
      >
        <CookiesProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            hideIconVariant
          >
            <Component {...pageProps} />
          </SnackbarProvider>
        </CookiesProvider>
      </AppContext.Provider>
    </div>
  );
}
