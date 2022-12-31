import React, { useEffect, useState } from 'react';
import { isBoolean, isEmpty, isNull } from 'lodash';
import Link from 'next/link';
import { useCookies } from 'react-cookie';
import Router, { useRouter } from 'next/router';
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather';
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
          className="h-full w-full bg-cover bg-center rounded-tl-3xl flex items-end p-5 xl:p-10"
          style={{
            backgroundImage: 'url("/placeholder.jpg")',
          }}
        >
          <div className="text-dark-100 flex items-end justify-between w-full">
            <div className="xl:mr-5 flex-1">
              <h2 className="text-2xl font-medium capitalize">Lorem ipsum dolor sit amet</h2>
              <p className="mt-2 leading-snug font-light max-w-md">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              <button type="button" className="mt-5 rounded-md h-10 px-10 text-dark-100 text-sm font-medium border border-dark-100 hover:bg-dark-100 hover:text-dark-900">
                Learn More
              </button>
            </div>
            <div className="xl:flex items-center hidden">
              <button type="button" className="mr-5 opacity-50 hover:opacity-100 transition duration-150 ease-in-out">
                <div>
                  <ArrowLeftCircle className="h-10 w-10" strokeWidth={1} />
                </div>
              </button>
              <button type="button" className="opacity-50 hover:opacity-100 transition duration-150 ease-in-out">
                <div>
                  <ArrowRightCircle className="h-10 w-10" strokeWidth={1} />
                </div>
              </button>
            </div>

          </div>
        </div>
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
