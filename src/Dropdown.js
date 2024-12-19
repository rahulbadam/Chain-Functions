import React, { useState } from 'react';
import Select from 'react-select';

const options = [
  { value: 'function1', label: 'Function 1' },
  { value: 'function2', label: 'Function 2' },
  { value: 'function3', label: 'Function 3' },
  { value: 'function4', label: 'Function 4' },
  { value: 'function5', label: 'Function 5' },
  { value: 'function6', label: '-' },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    width: '100%',
    borderColor: state.isFocused ? '#DFDFDF' : '#DFDFDF',
    borderWidth: '1.5px',
    borderRadius: '8px',
    boxShadow: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }),
};

const Dropdown = ({ value = 'function2' }) => {
  const [selectedValue, setSelectedValue] = useState(() =>
    options.find(option => option.value === value)
  );

  const handleChange = (selectedOption) => {
    setSelectedValue(selectedOption);
  };

  return (
    <Select
      options={options}
      value={selectedValue}
      onChange={handleChange}
      isDisabled={true}
      styles={customStyles}
    />
  );
};

export default Dropdown;
