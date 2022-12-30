/* eslint-disable react/forbid-prop-types */
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useCookies } from 'react-cookie';
import Select from './Select';
import { auth } from '../utils/firebase';
import { useAppContext } from '../context/state';

const generator = require('generate-password');

const RANDOM_PASSWORD = generator.generate({
  length: 12,
  numbers: true,
  symbols: true,
});

function OnBoarding({
  occupations, states, setStep, setInfo, info,
}) {
  const [cookies, setCookie] = useCookies(['user']);

  const {
    setUser,
  } = useAppContext();

  // Alerts
  const { enqueueSnackbar } = useSnackbar();

  // Handle Occupation and State
  const [occupation, setOccupation] = useState({ name: '', value: '' });
  const [state, setState] = useState({ name: '', value: '' });

  const validateOccupation = (occupation) => !!occupation.value;

  const validateState = (state) => !!state.value;

  const onBack = () => {
    signOut(auth).then(() => {
      setInfo({ ...info, password: '' });
      setStep(0);
      setUser(false);
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateOccupation(occupation) && validateState(state)) {
      const formData = {
        ...info, state: state.value, occupation: occupation.name, password: info.password || RANDOM_PASSWORD,
      };
      setInfo(formData);

      await fetch('https://frontend-take-home.fetchrewards.com/form', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then((res) => res.json()).then((res) => {
        enqueueSnackbar(
          'Account created successfully.',
          { variant: 'success', preventDuplicate: true },
        );
        setCookie('user', JSON.stringify(res), { path: '/' });
      });
    } else {
      const errors = [];

      if (!validateOccupation(occupation)) {
        errors.push('Occupation');
      }

      if (!validateState(state)) {
        errors.push('State');
      }

      enqueueSnackbar(
        `Missing Fields: ${errors.join(', ')}`,
        { variant: 'error', preventDuplicate: true },
      );
    }
  };

  return (
    <div className="mt-10">
      <h1 className="text-2xl font-semibold">
        Welcome,
        {' '}
        {info.name.split(' ')[0]}
        !
      </h1>
      <h3 className="font-light">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </h3>

      <hr className="my-5" />

      <form>
        <Select
          placeholder="Occupation"
          options={occupations}
          option={occupation}
          setOption={setOccupation}
        />
        <div className="mt-3">
          <Select
            placeholder="State"
            options={states}
            option={state}
            setOption={setState}
          />
        </div>
        <div className="flex mt-3">
          <button
            onClick={() => onBack()}
            type="button"
            className="btn-light h-10 mr-3"
          >
            Back
          </button>
          <button
            onClick={onSubmit}
            type="submit"
            className="btn-dark text-sm h-10"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

OnBoarding.propTypes = {
  occupations: PropTypes.array.isRequired,
  states: PropTypes.array.isRequired,
  info: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
};

export default OnBoarding;
