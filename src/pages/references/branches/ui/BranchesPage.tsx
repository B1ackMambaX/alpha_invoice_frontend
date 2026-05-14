import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Box } from "@chakra-ui/react";
import { MainLayout } from "@widgets/main-layout";
import { DataTable } from "@shared/ui";
import {
  useGetBranchesQuery,
  type BranchItem,
  type BranchFilters,
} from "@entities/branch";
import { BranchesFilters } from "@widgets/branches-filters";
import { CreateBranchButton } from "@widgets/create-branch";
import { formatDateTime } from "@shared/lib";

const columns: ColumnDef<BranchItem>[] = [
  { accessorKey: "code", header: "Код" },
  { accessorKey: "name", header: "Наименование" },
  { accessorKey: "address", header: "Адрес" },
  { accessorKey: "inn", header: "ИНН" },
  { accessorKey: "kpp", header: "КПП" },
  {
    accessorKey: "created_at",
    header: "Дата создания",
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
  },
];

export const BranchesPage = () => {
  const [filters, setFilters] = useState<BranchFilters>({});

  const { data, currentData, isFetching, refetch } =
    useGetBranchesQuery(filters);
  const isLoading = isFetching && !currentData;

  return (
    <MainLayout
      isContentWithoutPadding
      title="Отделения"
      subtitle={<BranchesFilters filters={filters} onChange={setFilters} />}
      actions={<CreateBranchButton onSuccess={refetch} />}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          isFetching={isFetching}
          hasNextPage={false}
          onFetchNextPage={() => {}}
        />
      </Box>
    </MainLayout>
  );
};
