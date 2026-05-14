import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Box, Badge } from "@chakra-ui/react";
import { MainLayout } from "@widgets/main-layout";
import { DataTable } from "@shared/ui";
import {
  useGetDataLoadLogInfiniteQuery,
  type DataLoadLogItem,
  type DataLoadLogFilters,
  LoadStatus,
  statusDictionary,
  LoadType,
  typeDictionary,
} from "@entities/data-load-log";
import { DataLoadFilters } from "@widgets/data-load-filters";
import { CreateDataLoadButton } from "@widgets/create-data-load";
import { formatDateTime } from "@shared/lib";

const columns: ColumnDef<DataLoadLogItem>[] = [
  {
    accessorKey: "started_at",
    header: "Дата и время начала загрузки",
    size: 180,
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "full"),
  },
  {
    accessorKey: "finished_at",
    header: "Дата и время конца загрузки",
    size: 180,
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "full"),
  },
  {
    accessorKey: "period_start",
    header: "Начало периода",
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
  },
  {
    accessorKey: "period_end",
    header: "Конец периода",
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
  },
  {
    accessorKey: "load_type",
    header: "Тип загрузки",
    cell: ({ getValue }) => (
      <Badge>{typeDictionary[getValue<LoadType>()]}</Badge>
    ),
  },
  { accessorKey: "account_number", header: "Номер счёта" },
  { accessorKey: "username", header: "Пользователь" },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ getValue }) => {
      const status = getValue<LoadStatus>();
      switch (status) {
        case LoadStatus.SUCCESS:
          return <Badge colorPalette="green">{statusDictionary[status]}</Badge>;
        case LoadStatus.IN_PROGRESS:
          return (
            <Badge colorPalette="yellow">{statusDictionary[status]}</Badge>
          );
        case LoadStatus.ERROR:
          return <Badge colorPalette="red">{statusDictionary[status]}</Badge>;
      }
    },
  },
  { accessorKey: "records_loaded", header: "Загружено записей", size: 120 },
  { accessorKey: "error_message", header: "Сообщение об ошибке" },
];

export const AbsUploadLogPage = () => {
  const [filters, setFilters] = useState<DataLoadLogFilters>({});

  const { data, currentData, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetDataLoadLogInfiniteQuery(filters);
  const isLoading = isFetching && !currentData;

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <MainLayout
      isContentWithoutPadding
      title="Журнал загрузки из АБС"
      subtitle={<DataLoadFilters filters={filters} onChange={setFilters} />}
      actions={<CreateDataLoadButton onSuccess={refetch} />}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={allItems}
          isLoading={isLoading}
          isFetching={isFetching}
          hasNextPage={hasNextPage ?? false}
          onFetchNextPage={fetchNextPage}
        />
      </Box>
    </MainLayout>
  );
};
