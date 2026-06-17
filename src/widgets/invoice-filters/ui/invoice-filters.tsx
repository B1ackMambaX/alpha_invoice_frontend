import type { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import { useGetBranchesQuery } from "@entities/branch";
import { useGetCounterpartiesQuery } from "@entities/counterparty";
import { FilterChip } from "@features/filter-chip";
import type { InvoiceFilters } from "@entities/invoice";
import { DateFilter } from "./date-filter";

type InvoiceFiltersProps = {
  filters: InvoiceFilters;
  onChange: (next: InvoiceFilters) => void;
  children?: ReactNode;
};

export function InvoiceFilters({ filters, onChange, children }: InvoiceFiltersProps) {
  const { data: branches = [] } = useGetBranchesQuery({});
  const branchOptions = branches.map((b) => ({ value: b.id, label: b.name }));

  const { data: counterpartiesData } = useGetCounterpartiesQuery();
  const counterpartyOptions = (counterpartiesData?.items ?? []).map((c) => ({
    value: c.id,
    label: c.short_name ?? c.full_name,
  }));

  return (
    <Flex gap={2} mt={3} align="center">
      <FilterChip
        label="Отделение"
        options={branchOptions}
        value={filters.branch_id}
        onChange={(branch_id) => onChange({ ...filters, branch_id })}
      />
      <FilterChip
        label="Контрагент"
        options={counterpartyOptions}
        value={filters.counterparty_id}
        onChange={(counterparty_id) => onChange({ ...filters, counterparty_id })}
      />
      <DateFilter
        label="С"
        value={filters.date_from}
        onChange={(date_from) => onChange({ ...filters, date_from })}
      />
      <DateFilter
        label="По"
        value={filters.date_to}
        onChange={(date_to) => onChange({ ...filters, date_to })}
      />
      {children}
    </Flex>
  );
}
