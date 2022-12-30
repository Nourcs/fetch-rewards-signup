import React, { useEffect, useState } from 'react';
import { isBoolean, isEmpty, isNull } from 'lodash';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import Router, { useRouter } from 'next/router';
import Logo from '../public/logo/nourcs';
import SignupForm from '../components/Signup';
import OnBoarding from '../components/OnBoarding';
import { useAppContext } from '../context/state';

export default function Home({ occupations, states }) {
  const {
    user, setUser,
  } = useAppContext();
  const router = useRouter();

  const [cookies, setCookie] = useCookies(['user']);

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({
    name: '',
    email: '',
    password: '',
    occupation: '',
    state: '',
  });

  useEffect(() => {
    if (!cookies.user) {
      setCookie('user', '', { path: '/' });
    } else {
      router.push('/');
    }
  }, [cookies]);

  useEffect(() => {
    if (!isEmpty(user)) {
      const { displayName, email } = user;
      setInfo({
        ...info,
        name: displayName,
        email,
      });
    }
  }, [user]);

  console.log(user, info, cookies);

  if (user === null || !isEmpty(cookies.user)) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="flex min-h-screen text-dark-900 bg-dark-100">
      <section className="w-full md:w-1/2 xl:w-1/3 p-10">
        <Link href="/">
          <Logo className="h-16 fill-dark-900" />
        </Link>
        {{
          0: <SignupForm
            setStep={setStep}
            info={info}
            setInfo={setInfo}
          />,
          1: <OnBoarding
            occupations={occupations}
            states={states}
            info={info}
            setInfo={setInfo}
            setStep={setStep}
          />,
        }[step]}
      </section>
      <section className="hidden md:block w-1/2 xl:w-2/3 p-3 ">
        <div
          className="h-full w-full bg-cover bg-center rounded-tl-3xl"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1498758536662-35b82cd15e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3088&q=80")',
          }}
        />
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const res = await fetch('https://frontend-take-home.fetchrewards.com/form');
  const data = await res.json();

  const states = data.states.map((item) => ({ name: item.name, value: item.abbreviation }));
  const occupations = data.occupations.map((item) => ({ name: item, value: item.toLowerCase().split(' ').join('-') }));

  return {
    props: { occupations, states },
  };
}
