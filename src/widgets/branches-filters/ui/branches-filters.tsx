import { Flex } from "@chakra-ui/react";
import { useGetRegionalCentersQuery } from "@entities/regional-center";
import { FilterChip } from "@widgets/data-load-filters/ui/filter-chip";
import type { BranchFilters } from "@entities/branch";

type BranchesFiltersProps = {
  filters: BranchFilters;
  onChange: (next: BranchFilters) => void;
};

export function BranchesFilters({ filters, onChange }: BranchesFiltersProps) {
  const { data: centers = [] } = useGetRegionalCentersQuery();

  const centerOptions = centers.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Flex gap={2} mt={3} wrap="wrap">
      <FilterChip
        label="Региональный центр"
        options={centerOptions}
        value={filters.regional_center_id}
        onChange={(regional_center_id) =>
          onChange({ ...filters, regional_center_id })
        }
      />
    </Flex>
  );
}
