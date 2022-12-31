/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/forbid-prop-types */
import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import OutsideClickHandler from 'react-outside-click-handler';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

function Select({
  options, option, placeholder, setOption,
}) {
  // Handle Options Menu
  const [showOptions, setShowOptions] = useState(false);

  // Filter Options
  const [filteredOptions, setFilteredOptions] = useState([...options]);

  // Select input value on click for faster editing
  const inputRef = useRef(null);

  const handleInputClick = () => {
    setFilteredOptions([...options]);
    inputRef.current.selectionStart = 0;
  };

  // Handle Search + Filter Options
  const handleSearch = (name) => {
    // Show options menu if it's not shown
    if (!showOptions) setShowOptions(true);

    const exist = options.find((el) => el.name.toLowerCase() === name.toLowerCase());

    if (!isEmpty(exist)) {
      setOption(exist);
    } else {
      setOption({ name, value: '' });
    }

    const newOptions = [...options]
      .filter((item) => item.name.toLowerCase()
        .includes(name.toLowerCase()));

    setFilteredOptions(newOptions);
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setShowOptions(false);
        const exist = options.find((el) => el.name.toLowerCase() === option.name.toLowerCase());
        if (!isEmpty(exist)) {
          setOption(exist);
        } else {
          setOption({ name: '', value: '' });
        }
      }}
    >
      <div className="relative">
        <label className="relative" htmlFor={`select_${placeholder.split(' ').filter((item) => item).join('_').toLowerCase()}`}>
          <input
            id={`select_${placeholder.split(' ').filter((item) => item).join('_').toLowerCase()}`}
            onClick={() => handleInputClick()}
            ref={inputRef}
            type="text"
            className="custom-form text-left flex items-center justify-between"
            placeholder={placeholder}
            value={option.name}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowOptions(true)}
            autocomplete="off"
          />
          <button
            type="button"
            className="absolute top-3 right-3"
            onClick={() => {
              setShowOptions(!showOptions);
              if (!option.value) {
                setOption({ name: '', value: '' });
              }
            }}
          >
            {showOptions ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
          </button>
        </label>
        {showOptions && (
        <ul className="w-full bg-white absolute z-10 drop-shadow-md rounded-md mt-2 py-2 max-h-40 overflow-y-auto">
          {filteredOptions.length === 0 ? <li className="px-4 py-2 text-sm">No Results</li> : filteredOptions.map((item) => (
            <li
              key={item.value}
              className={`cursor-pointer w-full text-left px-4 py-2 text-sm ${option.value === item.value ? 'bg-dark-800 text-white' : 'hover:bg-dark-200'}`}
              onClick={() => {
                setOption(item);
                setShowOptions(false);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
        )}
      </div>
    </OutsideClickHandler>
  );
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  option: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  setOption: PropTypes.func.isRequired,
};

export default Select;
