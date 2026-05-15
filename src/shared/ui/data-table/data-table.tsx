import { useRef, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, Flex, Spinner } from "@chakra-ui/react";

const OVERSCAN = 5;
const ESTIMATED_ROW_HEIGHT = 48;
const BORDER = "1px solid #E2E8F0";

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  onFetchNextPage: () => void;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  isFetching,
  hasNextPage,
  onFetchNextPage,
  sorting = [],
  onSortingChange,
}: DataTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: { sorting },
    onSortingChange,
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();
  const paddingTop = virtualItems[0]?.start ?? 0;
  const paddingBottom =
    totalSize - (virtualItems[virtualItems.length - 1]?.end ?? 0);

  const isFetchingRef = useRef(isFetching);
  isFetchingRef.current = isFetching;
  const hasNextPageRef = useRef(hasNextPage);
  hasNextPageRef.current = hasNextPage;
  const onFetchNextPageRef = useRef(onFetchNextPage);
  onFetchNextPageRef.current = onFetchNextPage;

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el || isFetchingRef.current || !hasNextPageRef.current) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const avgSize =
      virtualizer.getTotalSize() / (virtualizer.options.count || 1);
    if (distanceFromBottom < avgSize * OVERSCAN) {
      onFetchNextPageRef.current();
    }
  }, []);

  if (isLoading) {
    return (
      <Flex flex="1" justify="center" align="center">
        <Spinner color="brand" size="lg" />
      </Flex>
    );
  }

  return (
    <Flex direction="column" height="100%" overflow="hidden">
      <Box ref={parentRef} overflow="auto" flex="1" onScroll={handleScroll}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              background: "white",
            }}
          >
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const canSort = h.column.getCanSort();
                  const sorted = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        borderBottom: BORDER,
                        fontWeight: 600,
                        fontSize: "14px",
                        wordBreak: "break-word",
                        width: h.getSize(),
                        cursor: canSort ? "pointer" : "default",
                        userSelect: canSort ? "none" : undefined,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {canSort && (
                        <span style={{ marginLeft: 4, opacity: sorted ? 1 : 0.35 }}>
                          {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ height: paddingTop, padding: 0 }}
                />
              </tr>
            )}
            {virtualItems.map((vRow) => {
              const row = rows[vRow.index];
              return (
                <tr
                  key={row.id}
                  data-index={vRow.index}
                  ref={virtualizer.measureElement}
                  style={{ borderBottom: BORDER }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ padding: "12px 16px", fontSize: "14px", wordBreak: "break-word" }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ height: paddingBottom, padding: 0 }}
                />
              </tr>
            )}
          </tbody>
        </table>
      </Box>
      {isFetching && !isLoading && (
        <Flex justify="center" p={4}>
          <Spinner color="brand" />
        </Flex>
      )}
    </Flex>
  );
}
