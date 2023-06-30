import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface GenericCollectionProps<T> {
  headline?: string;
  inputType: 'text' | 'date';
  onInputChange: (value: T) => void;
  value?: T;
}

const GenericCollection: React.FC<GenericCollectionProps<any>> = ({
  headline,
  inputType,
  onInputChange,
  value
}) => {
  const renderField = () => {
    if (inputType === 'date') {
      return (
        <DatePicker
          selected={value || new Date()}
          onChange={date => onInputChange(date)}
          dateFormat="yyyy-MM-dd"
        />
      );
    }

    return (
      <input
        type={inputType}
        value={value || ''}
        onChange={event => onInputChange(event.target.value)}
      />
    );
  };

  return (
    <div>
      {headline && <h2>{headline}</h2>}
      {renderField()}
    </div>
  );
};

export default GenericCollection;
