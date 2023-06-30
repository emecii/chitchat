import React from 'react';

interface GenderCollectionProps {
  selectedOption?: string | undefined;
  onSelectOption: (option: string) => void;
}

const GenderCollection: React.FC<GenderCollectionProps> = ({
  selectedOption,
  onSelectOption
}) => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '10px' }}>
          <label>
            <input
              type="radio"
              value="Male"
              checked={selectedOption === "Male"}
              onChange={() => onSelectOption("Male")}
            />
            Male
          </label>
        </div>
        <div style={{ marginRight: '10px' }}>
          <label>
            <input
              type="radio"
              value="Female"
              checked={selectedOption === "Female"}
              onChange={() => onSelectOption("Female")}
            />
            Female
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="Unknown"
              checked={selectedOption === "Unknown"}
              onChange={() => onSelectOption("Unknown")}
            />
            Unknown
          </label>
        </div>
      </div>
    </div>
  );
};

export default GenderCollection;
