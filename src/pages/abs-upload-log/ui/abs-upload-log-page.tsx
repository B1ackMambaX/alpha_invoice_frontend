import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Box } from "@chakra-ui/react";
import { MainLayout } from "@widgets/main-layout";
import { DataTable } from "@shared/ui";
import {
  useGetDataLoadLogInfiniteQuery,
  type DataLoadLogItem,
  type DataLoadLogFilters,
} from "@entities/data-load-log";
import { DataLoadFilters } from "@widgets/data-load-filters";
import { CreateDataLoadButton } from "@widgets/create-data-load";

const columns: ColumnDef<DataLoadLogItem>[] = [
  { accessorKey: "load_type", header: "Тип загрузки" },
  { accessorKey: "status", header: "Статус" },
  { accessorKey: "period_start", header: "Начало периода" },
  { accessorKey: "period_end", header: "Конец периода" },
  { accessorKey: "account_number", header: "Номер счёта" },
  { accessorKey: "username", header: "Пользователь" },
  { accessorKey: "records_loaded", header: "Загружено записей" },
  { accessorKey: "started_at", header: "Начало" },
  { accessorKey: "finished_at", header: "Окончание" },
];

export const AbsUploadLogPage = () => {
  const [filters, setFilters] = useState<DataLoadLogFilters>({});

  const { data, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetDataLoadLogInfiniteQuery(filters);

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <MainLayout
      title="Журнал загрузки из АБС"
      subtitle={<DataLoadFilters filters={filters} onChange={setFilters} />}
      actions={<CreateDataLoadButton onSuccess={refetch} />}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={allItems}
          isFetching={isFetching}
          hasNextPage={hasNextPage ?? false}
          onFetchNextPage={fetchNextPage}
        />
      </Box>
    </MainLayout>
  );
};
