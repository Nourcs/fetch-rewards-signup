import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import { isEmpty } from 'lodash';
import { signOut } from 'firebase/auth';
import { useAppContext } from '../context/state';
import { auth } from '../utils/firebase';

function Home() {
  const [isSSR, setIsSSR] = useState(true);

  const {
    setUser,
  } = useAppContext();
  const [cookies, setCookie] = useCookies(['user']);

  const logout = () => {
    signOut(auth).then(() => {
      setCookie('user', '', { path: '/' });
      setUser(false);
    });
  };

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <>
      {!isSSR && (
      <div className="flex items-center justify-center w-screen h-screen">
        {isEmpty(cookies.user) ? (
          <Link href="/signup">
            <button type="button" className="btn-light h-12 px-10">
              Sign up
            </button>
          </Link>
        )
          : (
            <div className="">
              <h1 className="text-xl font-semibold text-center">
                Welcome,
                {' '}
                {cookies.user.name.split(' ')[0]}
                !
              </h1>
              <button type="button" className="btn-light h-12 px-10 mt-3" onClick={logout}>Log out</button>
            </div>
          )}
      </div>
      )}
    </>
  );
}

export default Home;
