import { useState } from "react";
import type { ColumnDef, SortingState, OnChangeFn } from "@tanstack/react-table";
import { Box, Badge, Flex } from "@chakra-ui/react";
import { MainLayout } from "@widgets/main-layout";
import { DataTable, RefetchButton } from "@shared/ui";
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
    enableSorting: true,
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "full"),
  },
  {
    accessorKey: "finished_at",
    header: "Дата и время конца загрузки",
    size: 180,
    enableSorting: true,
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "full"),
  },
  {
    accessorKey: "period_start",
    header: "Начало периода",
    enableSorting: true,
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
  },
  {
    accessorKey: "period_end",
    header: "Конец периода",
    enableSorting: true,
    cell: ({ getValue }) => formatDateTime(getValue<string>(), "date"),
  },
  {
    accessorKey: "load_type",
    header: "Тип загрузки",
    enableSorting: true,
    cell: ({ getValue }) => (
      <Badge>{typeDictionary[getValue<LoadType>()]}</Badge>
    ),
  },
  { accessorKey: "account_number", header: "Номер счёта", enableSorting: true },
  { accessorKey: "username", header: "Пользователь", enableSorting: true },
  {
    accessorKey: "status",
    header: "Статус",
    enableSorting: true,
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
  { accessorKey: "records_loaded", header: "Загружено записей", size: 120, enableSorting: true },
  { accessorKey: "error_message", header: "Сообщение об ошибке", enableSorting: false },
];

export const AbsUploadLogPage = () => {
  const [filters, setFilters] = useState<Omit<DataLoadLogFilters, "sort_by" | "sort_order">>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const queryFilters: DataLoadLogFilters = {
    ...filters,
    ...(sorting[0] && { sort_by: sorting[0].id, sort_order: sorting[0].desc ? "DESC" : "ASC" }),
  };

  const { data, currentData, isFetching, fetchNextPage, hasNextPage, refetch } =
    useGetDataLoadLogInfiniteQuery(queryFilters);
  const isLoading = isFetching && !currentData;

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => (typeof updater === "function" ? updater(prev) : updater));
  };

  return (
    <MainLayout
      isContentWithoutPadding
      title="Журнал загрузки из АБС"
      subtitle={<DataLoadFilters filters={filters} onChange={setFilters} />}
      actions={<Flex gap={2}><RefetchButton onClick={refetch} isFetching={isFetching} /><CreateDataLoadButton onSuccess={refetch} /></Flex>}
    >
      <Box height="100%" display="flex" flexDirection="column">
        <DataTable
          columns={columns}
          data={allItems}
          isLoading={isLoading}
          isFetching={isFetching}
          hasNextPage={hasNextPage ?? false}
          onFetchNextPage={fetchNextPage}
          sorting={sorting}
          onSortingChange={handleSortingChange}
        />
      </Box>
    </MainLayout>
  );
};
