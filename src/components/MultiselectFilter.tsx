import { CSSProperties } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

export type Option = {
  value: string
  label: string
}

type Props = {
  options: Option[],
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

const MultiselectFilter = ({ options, title, onChange }: Props) => {
  const id = `select-${title}`;
  return (
    <div>
      <label style={style.label} id="aria-label" htmlFor={`#${id}`}>
        {title}
      </label>

      <Select
        id={title}
        options={options}
        placeholder={title}
        components={animatedComponents}
        isMulti
        name="colors"
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(options) => {
          if (onChange) {
            onChange((options as Option[]).map((option) => option.value));
          }
        }} />
    </div >
  )
}

export default MultiselectFilter
