import React from "react";

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded font-medium shadow hover:scale-105 transition-all duration-200 ${className}`}
  >
    {children}
  </button>
);

export { Button };
