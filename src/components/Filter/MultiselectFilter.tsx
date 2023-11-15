import { CSSProperties, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import { MdJoinFull, MdJoinInner } from "react-icons/md";
import { useTranslation } from 'react-i18next';

export type OptionType = {
  value: string
  label: string
}

export type FilterStatus = {
  selected: OptionType[],
  isAnd: boolean
}

type Props = {
  options?: OptionType[],
  filterStatus: FilterStatus,
  title?: string,
  onChange: (newFilterStatus: FilterStatus) => void,
  hasAndCheckbox?: boolean,
  allowCreate?: boolean
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

const MultiselectFilter = ({ options=[], title, onChange, filterStatus, hasAndCheckbox = false, allowCreate = false }: Props) => {
  // @ToDo: does not load from localStorage
  const {t} = useTranslation('multiselect_filter');

  const id = `select-${title}`;

  const [isAnd, setIsAnd] = useState(filterStatus.isAnd);
  const [selected, setSelected] = useState<OptionType[]>(filterStatus.selected);

  const handleSelectChange = (options: MultiValue<OptionType>) => {
    //const selectedOptions = options.map((option) => option as OptionType);
    setSelected(options as OptionType[]);
    if (onChange) onChange({
      selected: options as OptionType[],
      isAnd: isAnd
    });
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAndSelected = event.target.id === `${id}-is-and`;
    setIsAnd(isAndSelected);
    if (onChange) onChange({
      selected: [...selected],
      isAnd: isAndSelected
    })
  }

  return (
    <div>
      <label style={style.label} id="aria-label" htmlFor={`#${id}`}>
        {title}
      </label>
      <span className='d-flex align-items-center gap-1'>
        {!allowCreate ?
          <Select
            id={title}
            name={title}
            placeholder={title}
            className="basic-multi-select flex-grow-1"
            isMulti
            options={options}
            defaultValue={selected}
            components={animatedComponents}
            classNamePrefix="select"
            onChange={handleSelectChange} /> :
          <CreatableSelect
            id={title}
            name={title}
            placeholder={title}
            className="basic-multi-select flex-grow-1"
            isMulti
            options={options}
            defaultValue={selected}
            components={animatedComponents}
            classNamePrefix="select"
            onChange={handleSelectChange} />
        }
        {hasAndCheckbox &&
          <>
            <div className="btn-group" role="group">
              <input
                type="radio"
                className="btn-check"
                name={`${id}-is-and`}
                id={`${id}-is-or`}
                checked={!isAnd}
                onChange={handleRadioChange} />
              <label
                className="btn btn-outline-light"
                htmlFor={`${id}-is-or`}
                title={t('title.all_matches')}>
                <MdJoinFull />
              </label>

              <input
                type="radio"
                className="btn-check"
                name={`${id}-is-and`}
                id={`${id}-is-and`}
                checked={isAnd}
                onChange={handleRadioChange} />
              <label
                className="btn btn-outline-light"
                htmlFor={`${id}-is-and`}
                title={t('title.any_match')}>
                <MdJoinInner />
              </label>
            </div>
          </>
        }
      </span>
    </div >
  )
}

export default MultiselectFilter;
