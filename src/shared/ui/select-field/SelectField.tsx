import { useMemo } from "react";
import { Field } from "react-final-form";
import {
  Select,
  Portal,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
  createListCollection,
} from "@chakra-ui/react";

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

export const SelectField = ({ name, label, options, placeholder }: SelectFieldProps) => {
  const collection = useMemo(
    () => createListCollection({ items: options, itemToValue: (o) => o.value, itemToString: (o) => o.label }),
    [options],
  );

  return (
    <Field name={name}>
      {({ input, meta }) => {
        const isInvalid = meta.touched && !!meta.error;
        const value = input.value ? [input.value] : [];

        return (
          <FieldRoot invalid={isInvalid}>
            <FieldLabel>{label}</FieldLabel>
            <Select.Root
              collection={collection}
              value={value}
              onValueChange={(e) => input.onChange(e.value[0] ?? "")}
              onInteractOutside={() => input.onBlur()}
            >
              <Select.Control borderRadius="16px" border="1px solid" borderColor="border">
                <Select.Trigger>
                  <Select.ValueText placeholder={placeholder ?? label} />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {collection.items.map((opt) => (
                      <Select.Item key={opt.value} item={opt}>
                        <Select.ItemText>{opt.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
          </FieldRoot>
        );
      }}
    </Field>
  );
};
