import { CSSProperties } from 'react';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { CardFilter } from './Filters';

export type OptionType = {
  value: string
  label: string
}

type Props = {
  options: readonly OptionType[],
  selected?: CardFilter,
  title?: string,
  onChange: (selected: string[]) => void
}

const style: { [key: string]: CSSProperties } = {
  label: {
    fontSize: '.75rem',
    fontWeight: 'bold',
    lineHeight: 2,
    color: "white"
  },
};


const animatedComponents = makeAnimated();

const MultiselectFilter = ({ options, title, onChange, selected }: Props) => {
  const id = `select-${title}`;

  const selectedOptions = options.filter((option) => selected?.values.includes(option.value));
  const handleChangeChange = (options: MultiValue<OptionType>) => {
    const selectedOptions = options.map((option) => option.value);
    if (onChange) {
      onChange(selectedOptions);
    }
  }
  return (
    <div>
      <label style={style.label} id="aria-label" htmlFor={`#${id}`}>
        {title}
      </label>

      <Select
        id={title}
        options={options}
        defaultValue={selectedOptions}
        placeholder={title}
        components={animatedComponents}
        isMulti
        name="colors"
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(options) => handleChangeChange(options)} />
    </div >
  )
}

export default MultiselectFilter
