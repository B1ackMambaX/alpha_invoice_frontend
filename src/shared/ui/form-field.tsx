import { Field } from "react-final-form";
import { FieldRoot, FieldLabel, FieldErrorText, Input } from "@chakra-ui/react";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  digitsOnly?: boolean;
}

export const FormField = ({
  name,
  label,
  type = "text",
  placeholder,
  validate,
  digitsOnly,
}: FormFieldProps) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => {
      const isInvalid = meta.touched && !!meta.error;

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = digitsOnly ? e.target.value.replace(/\D/g, "") : e.target.value;
        input.onChange(val);
      };

      return (
        <FieldRoot invalid={isInvalid}>
          <FieldLabel>{label}</FieldLabel>
          <Input
            borderRadius="16px"
            {...input}
            type={type}
            placeholder={placeholder}
            inputMode={digitsOnly ? "numeric" : undefined}
            onChange={handleChange}
          />
          {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
        </FieldRoot>
      );
    }}
  </Field>
);
