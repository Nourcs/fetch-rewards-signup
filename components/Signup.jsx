import React, { useEffect, useState } from 'react';
import {
  Eye, EyeOff,
} from 'react-feather';
import OutsideClickHandler from 'react-outside-click-handler';
import { useSnackbar } from 'notistack';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { isEmpty } from 'lodash';
import { useAppContext } from '../context/state';
import { auth } from '../utils/firebase';
import Requirements from './Requirements';

const PASSWORD_REQUIREMENTS = [
  { value: 'length', text: 'MUST contain at least 8 characters (12+ recommended)' },
  { value: 'uppercase', text: 'MUST contain at least one uppercase letter' },
  { value: 'lowercase', text: 'MUST contain at least one lowercase letter' },
  { value: 'number', text: 'MUST contain at least one number' },
  { value: 'special', text: 'MUST contain at least one special character (!”#$%&\'()*+,-./:;<=>?@[\]^_`{|}~ )' },
];

const UPPERCASE = Array.from(Array(26)).map((e, i) => String.fromCharCode(i + 65));
const LOWERCASE = UPPERCASE.map((item) => item.toLocaleLowerCase());
const NUMBERS = Array.from(Array(10)).map((e, i) => `${i}`);
const SPECIAL = '!”#$%&\'()*+,-./:;<=>?@[\]^_`{|}~ '.split('');

function SignupForm({ setStep, info, setInfo }) {
  // User Context
  const {
    setUser, user,
  } = useAppContext();

  // Google Authentication
  const provider = new GoogleAuthProvider();

  const onAuthClick = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const {
          displayName, email,
        } = result.user;
        setUser({
          displayName, email,
        });
      });
  };

  useEffect(() => {
    if (!isEmpty(user)) {
      setStep(1);
    }
  }, [user]);

  // Alerts
  const { enqueueSnackbar } = useSnackbar();

  // Password Requirements Handler
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  // Show/Hide Password
  const [showPassword, setShowPassword] = useState('password');

  // Name Validation
  const validateName = (name) => name.split(' ').filter((item) => item).length >= 2;

  // Email Validation
  const validateEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

  // Password Validation
  const validatePassword = (password) => {
    const valid = [];

    // Check Lenght
    if (password.length >= 8) {
      valid.push('length');
    }
    // Check Uppercase
    if (password.split('').some((item) => UPPERCASE.includes(item))) {
      valid.push('uppercase');
    }
    // Check Lowercase
    if (password.split('').some((item) => LOWERCASE.includes(item))) {
      valid.push('lowercase');
    }
    // Check Number
    if (password.split('').some((item) => NUMBERS.includes(item))) {
      valid.push('number');
    }
    // Check Special Character
    if (password.split('').some((item) => SPECIAL.includes(item))) {
      valid.push('special');
    }

    return valid;
  };

  // On Next
  const onNext = (e) => {
    e.preventDefault();

    const { email, password, name } = info;

    if (validateEmail(email)
    && validatePassword(password).length === PASSWORD_REQUIREMENTS.length
    && validateName(name)) {
      setStep(1);
    } else {
      const errors = [];

      if (!validateName(name)) {
        errors.push('Name');
      }

      if (!validateEmail(email)) {
        errors.push('Email');
      }

      if (validatePassword(password).length !== PASSWORD_REQUIREMENTS.length) {
        errors.push('Password');
      }

      enqueueSnackbar(
        `Missing or Incorrect Fields: ${errors.join(', ')}`,
        { variant: 'error', preventDuplicate: true },
      );
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-semibold">
        Lorem ipsum dolor
      </h1>
      <h3 className="font-light">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </h3>
      <div className="mt-5">
        <button type="button" className="btn-light h-12 text-sm" onClick={() => onAuthClick()}>
          <div className="mr-3 shrink-0">
            <img src="/logo/google.png" className="h-4 w-4" alt="Google" />
          </div>
          Sign up with Google
        </button>
      </div>
      <hr className="my-5" />
      <form>
        <div className="block mb-3">
          <input
            type="text"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            placeholder="Full Name"
            className={`custom-form ${validateName(info.name) ? 'focus:outline-success' : 'focus:outline-warning'}`}
          />
        </div>
        <div className="block mb-3">
          <input
            type="email"
            placeholder="Email"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            className={`custom-form ${validateEmail(info.email) ? 'focus:outline-success' : 'focus:outline-warning'}`}
          />
        </div>
        <OutsideClickHandler
          onOutsideClick={() => {
            setShowPasswordReqs(false);
          }}
        >
          <div className="mb-3 flex relative">
            <input
              onFocus={() => setShowPasswordReqs(true)}
              type={showPassword}
              value={info.password}
              onChange={(e) => setInfo({ ...info, password: e.target.value })}
              placeholder="Password"
              className={`custom-form ${validatePassword(info.password).length === PASSWORD_REQUIREMENTS.length ? 'focus:outline-success' : 'focus:outline-warning'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-[10px]"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPassword(showPassword === 'text' ? 'password' : 'text');
              }}
            >
              {showPassword === 'password' ? (<Eye className="h-5 w-5" />) : (<EyeOff className="h-5 w-5" />)}
            </button>

          </div>
        </OutsideClickHandler>

        <button
          onClick={onNext}
          type="submit"
          className="btn-dark text-sm mt-3 h-10"
        >
          Next
        </button>
        {showPasswordReqs && (
        <Requirements
          valid={validatePassword(info.password)}
          requirements={PASSWORD_REQUIREMENTS}
        />
        )}
      </form>
    </div>
  );
}

export default SignupForm;
