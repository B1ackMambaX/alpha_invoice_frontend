import { Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxW?: string;
}

export function SearchInput({ value, onChange, placeholder = "Поиск", maxW = "220px" }: SearchInputProps) {
  return (
    <InputGroup startElement={<LuSearch />} maxW={maxW}>
      <Input
        size="sm"
        borderRadius="12px"
        border="none"
        bg="white"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
}
