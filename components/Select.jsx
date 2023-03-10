/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'react-feather';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import { isEmpty } from 'lodash';

function Select({
  options, option, setOption, placeholder,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([...options]);
  const inputRef = useRef(null);

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

        if (!option.value) {
          setOption({ name: '', value: '' });
        }
      }}
    >
      <div className="relative">
        <label
          onFocus={() => {
            setFilteredOptions([...options]);
            setShowOptions(true);
            inputRef.current.selectionStart = 0;
            inputRef.current.selectionEnd = option.name.length;
          }}
          className="h-10 w-full bg-white flex items-center relative border border-dark-300 rounded-md"
          htmlFor={`select_${placeholder.split(' ').filter((item) => item).join('_').toLowerCase()}`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="h-10 flex-1 px-3 pr-10 text-sm bg-transparent"
            id={`select_${placeholder.split(' ').filter((item) => item).join('_').toLowerCase()}`}
            autoComplete="off"
            value={option.name}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="absolute right-3">
            {showOptions ? (<ChevronUp className="h-4 w-4" />) : (<ChevronDown className="h-4 w-4" />)}
          </div>
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
