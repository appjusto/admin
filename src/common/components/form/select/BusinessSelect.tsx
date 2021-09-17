import Select from 'react-select';

const customStyles = {
  //@ts-ignore
  control: (styles) => ({
    ...styles,
    border: 'none',
    backgroundColor: 'none',
    fontSize: '16px',
    color: '#505A4F',
    boxShadow: 'none',
    cursor: 'pointer',
  }),
  //@ts-ignore
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isFocused ? '#F6F5FF' : null,
      color: isSelected ? '#4EA031' : '#505A4F',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
    };
  },
  //@ts-ignore
  dropdownIndicator: (styles) => ({
    ...styles,
    'color': '#505A4F',
    ':hover': {
      color: '#505A4F',
    },
  }),
  //@ts-ignore
  indicatorSeparator: (styles) => ({ display: 'none' }),
  //@ts-ignore
  input: (styles) => ({ ...styles, color: '#505A4F', border: 'none' }),
  //@ts-ignore
  placeholder: (styles) => ({ display: 'none' }),
  //@ts-ignore
  valueContainer: (styles) => ({ ...styles, paddingLeft: '0' }),
  //@ts-ignore
  singleValue: (styles) => ({
    ...styles,
    fontWeight: '500',
    color: '#505A4F',
  }),
};

export type BusinessSelectOptions = { value: string; label: string };

interface BusinessSelectProps {
  options: BusinessSelectOptions[];
  selected?: BusinessSelectOptions;
  onChange(selected: BusinessSelectOptions): void;
}

export const BusinessSelect = ({ options, selected, onChange }: BusinessSelectProps) => {
  return (
    <Select
      instanceId="lang-select"
      options={options}
      styles={customStyles}
      value={selected}
      //@ts-ignore
      onChange={onChange}
      isSearchable={false}
    />
  );
};
