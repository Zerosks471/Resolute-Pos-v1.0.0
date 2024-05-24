import React from "react";

const NumberPad = ({ onInput, onClear, onDelete }) => {
  const handleButtonClick = (value) => {
    onInput(value);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((value) => (
        <button
          key={value}
          onClick={() => handleButtonClick(value.toString())}
          className="btn btn-secondary"
        >
          {value}
        </button>
      ))}
      <button onClick={onClear} className="btn btn-danger">
        Clear
      </button>
      <button onClick={onDelete} className="btn btn-warning">
        Del
      </button>
    </div>
  );
};

export default NumberPad;
