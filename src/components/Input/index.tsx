import React from "react";

const Input = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & { long?: boolean; maxSize?: number }
) => {
  const { long = false, maxSize = long ? 255 : 50, onChange } = props;

  return (
    <input
      {...props}
      onChange={(e) => {
        const {
          target: { value },
        } = e;
        if (value.length >= maxSize) {
        } else if (onChange) {
          onChange(e);
        }
      }}
    />
  );
};

export default Input;
