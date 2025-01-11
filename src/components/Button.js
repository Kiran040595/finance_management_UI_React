// Button.js
import React from 'react';

function Button({ label, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 border rounded ${className} ${disabled ? 'bg-gray-200' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
    >
      {label}
    </button>
  );
}

export default Button;
