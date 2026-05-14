import { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { FilterChip } from "@features/filter-chip";
import { SearchInput } from "@shared/ui";
import type { ResponsibleFilters } from "@entities/responsible";

type ResponsibleFiltersProps = {
  filters: ResponsibleFilters;
  onChange: (next: ResponsibleFilters) => void;
};

export function ResponsibleFiltersBar({
  filters,
  onChange,
}: ResponsibleFiltersProps) {
  const { data: centers = [] } = useGetRegionalCentersQuery();
  const [searchValue, setSearchValue] = useState(filters.username ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, username: searchValue || undefined });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (!filters.username) setSearchValue("");
  }, [filters.username]);

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Flex gap={2} mt={3} align="center">
      <FilterChip
        label="Региональный центр"
        options={centerOptions}
        value={filters.regional_center_id}
        onChange={(regional_center_id) =>
          onChange({ ...filters, regional_center_id })
        }
      />
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Поиск по пользователю"
      />
    </Flex>
  );
}
