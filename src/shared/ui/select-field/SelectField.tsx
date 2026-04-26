import { Field } from "react-final-form";
import { NativeSelect, FieldRoot, FieldLabel, FieldErrorText } from "@chakra-ui/react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = ({
  name,
  label,
  options,
  placeholder,
}: SelectFieldProps) => (
  <Field name={name}>
    {({ input, meta }) => {
      const isInvalid = meta.touched && !!meta.error;
      return (
        <FieldRoot invalid={isInvalid}>
          <FieldLabel>{label}</FieldLabel>
          <NativeSelect.Root>
            <NativeSelect.Field
              {...input}
              borderRadius="16px"
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
        </FieldRoot>
      );
    }}
  </Field>
);
