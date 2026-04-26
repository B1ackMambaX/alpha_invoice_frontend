import { Field } from "react-final-form";
import { FieldRoot, FieldLabel, FieldErrorText, Input } from "@chakra-ui/react";

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
}

export const FormField = ({
  name,
  label,
  type = "text",
  placeholder,
  validate,
}: FormFieldProps) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => {
      const isInvalid = meta.touched && !!meta.error;

      return (
        <FieldRoot invalid={isInvalid}>
          <FieldLabel>{label}</FieldLabel>
          <Input
            borderRadius="16px"
            {...input}
            type={type}
            placeholder={placeholder}
          />
          {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
        </FieldRoot>
      );
    }}
  </Field>
);
