import React from 'react';
import { DateField } from 'govuk-react';
import type { DateFieldProps } from '@govuk-react/date-field';

const RHFDateField: React.FC<{
  input: {
    value?: {
      day?: string;
      month?: string;
      year?: string;
    },
    onChange: (e: {
      target: {
        value: {
          day?: string;
          month?: string;
          year?: string;
        },
        name: string,
      }
    }) => void,
    onBlur: (e: {
      target: {
        value: {
          day?: string;
          month?: string;
          year?: string;
        },
        name: string,
      }
    }) => void,
    name: string,
  },
} & Omit<DateFieldProps, 'input'>> = ({ input: { onChange, onBlur, ...input }, children, ...props }) => {
  const [value, setValue] = React.useState(input?.value ?? {});
  return (
    <DateField
      {...props}
      input={{
        onChange: (newValue) => {
          setValue({ ...value, ...newValue });
          onChange({ target: { value: { ...value, ...newValue }, name: input.name } });
        },
        onBlur: () => onBlur({ target: { value, name: input.name } }),
        ...input,
      }}
    >
      {children}
    </DateField>
  );
};

export default RHFDateField;
