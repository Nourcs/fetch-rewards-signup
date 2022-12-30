import React from 'react';
import { Check, X } from 'react-feather';

function Requirements({ valid, requirements }) {
  return (
  // <div className="bg-white drop-shadow-md absolute bottom-full right-0 md:left-full md:bottom-0 md:ml-5 w-full mb-3 md:mb-0 sm:w-96 p-5 rounded-md">
    <div className="mt-3">
      <h4 className="text- font-semibold underlisne mb-3">Password Requirements</h4>
      <ul className="text-sm">
        {requirements.map((item) => (
          <li key={item.value} className={`flex ${valid.includes(item.value) ? 'text-success' : 'text-warning'}`}>
            <div className="mr-2 mt-0.5">{valid.includes(item.value) ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}</div>
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Requirements;
