import { useState, useEffect } from "react";
import { Flex, Input, InputGroup } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { useGetBranchesQuery } from "@entities/branch";
import { FilterChip } from "@widgets/data-load-filters/ui/filter-chip";
import type { VatAccountFilters } from "@entities/vat-account";

type VatAccountsFiltersProps = {
  filters: VatAccountFilters;
  onChange: (next: VatAccountFilters) => void;
};

export function VatAccountsFilters({ filters, onChange }: VatAccountsFiltersProps) {
  const { data: centers = [] } = useGetRegionalCentersQuery();
  const { data: branches = [] } = useGetBranchesQuery({
    regional_center_id: filters.regional_center_id,
  });

  const [searchValue, setSearchValue] = useState(filters.account_number ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, account_number: searchValue || undefined });
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (!filters.account_number) setSearchValue("");
  }, [filters.account_number]);

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));
  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }));

  const handleCenterChange = (regional_center_id: string | undefined) => {
    onChange({ ...filters, regional_center_id, branch_id: undefined });
  };

  return (
    <Flex gap={2} mt={3} wrap="wrap" align="center">
      <FilterChip
        label="Региональный центр"
        options={centerOptions}
        value={filters.regional_center_id}
        onChange={handleCenterChange}
      />
      <FilterChip
        label="Отделение"
        options={branchOptions}
        value={filters.branch_id}
        onChange={(branch_id) => onChange({ ...filters, branch_id })}
      />
      <InputGroup startElement={<LuSearch />} maxW="220px">
        <Input
          size="sm"
          borderRadius="full"
          placeholder="Поиск по номеру счёта"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </InputGroup>
    </Flex>
  );
}
