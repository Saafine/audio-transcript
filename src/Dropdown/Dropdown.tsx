import React, { useState } from 'react';
import './Dropdown.scss';

export function Dropdown({
  value,
  options,
  onOptionSelected,
}: {
  value: string;
  options: string[];
  onOptionSelected: (option: string) => void;
}) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpened(!opened)}
        className="btn btn-secondary cursor-pointer select-none"
      >
        {value}
      </button>
      {opened ? (
        <div className="dropdown__options shadow-xs">
          {options.map((option) => (
            <div
              key={option}
              onClick={(event) => {
                setOpened(false);
                onOptionSelected(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
