import { Flex } from "@chakra-ui/react";
import { type DataLoadLogFilters } from "@entities/data-load-log";
import { FilterChip } from "./filter-chip";
import {
  STATUS_OPTIONS,
  PERIOD_OPTIONS,
  LOAD_TYPE_OPTIONS,
} from "../config/options";

type DataLoadFiltersProps = {
  filters: DataLoadLogFilters;
  onChange: (next: DataLoadLogFilters) => void;
};

export function DataLoadFilters({ filters, onChange }: DataLoadFiltersProps) {
  return (
    <Flex gap={2} mt={3} wrap="wrap">
      <FilterChip
        label="Период"
        options={PERIOD_OPTIONS}
        value={filters.period}
        onChange={(period) => onChange({ ...filters, period })}
      />
      <FilterChip
        label="Статус"
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />
      <FilterChip
        label="Тип загрузки"
        options={LOAD_TYPE_OPTIONS}
        value={filters.load_type}
        onChange={(load_type) => onChange({ ...filters, load_type })}
      />
    </Flex>
  );
}
