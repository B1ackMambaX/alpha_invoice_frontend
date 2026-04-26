import { Menu, Portal, Button } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface FilterChipProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (value: T | undefined) => void;
}

export function FilterChip<T extends string>({
  label,
  options,
  value,
  onChange,
}: FilterChipProps<T>) {
  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          borderRadius="full"
          variant={value ? "solid" : "outline"}
          colorPalette={value ? "brand" : "gray"}
        >
          {value ? (
            <>
              {selectedLabel}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(undefined);
                }}
                style={{ marginLeft: 4, fontWeight: "bold", fontSize: 14 }}
              >
                ×
              </span>
            </>
          ) : (
            <>
              {label}
              <LuChevronDown />
            </>
          )}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {options.map((opt) => (
              <Menu.Item
                key={opt.value}
                value={opt.value}
                onClick={() => onChange(opt.value)}
                fontWeight={value === opt.value ? "bold" : "normal"}
              >
                {opt.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
