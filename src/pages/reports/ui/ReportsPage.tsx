import { VStack } from '@chakra-ui/react';
import { MainLayout } from '@widgets/main-layout';
import { ExportReportCard } from '@features/export-report';
import {
  useLazyExportInvoiceRegistryQuery,
  useLazyExportSalesBookQuery,
  type ExportParams,
} from '@entities/report';

export const ReportsPage = () => {
  const [exportInvoiceRegistry] = useLazyExportInvoiceRegistryQuery();
  const [exportSalesBook] = useLazyExportSalesBookQuery();

  const handleExportRegistry = (params: ExportParams) =>
    exportInvoiceRegistry(params).unwrap();

  const handleExportSalesBook = (params: ExportParams) =>
    exportSalesBook(params).unwrap();

  return (
    <MainLayout title="Отчёты">
      <VStack gap={4} align="stretch">
        <ExportReportCard
          title="Реестр счетов-фактур"
          description="Выгрузка всех счетов-фактур за выбранный период в формате Excel"
          filename={({ date_from, date_to }) => `invoices_registry_${date_from}_${date_to}.xlsx`}
          onExport={handleExportRegistry}
        />
        <ExportReportCard
          title="Книга продаж"
          description="Книга продаж за выбранный период с данными по региональным центрам"
          filename={({ date_from, date_to }) => `sales_book_${date_from}_${date_to}.xlsx`}
          onExport={handleExportSalesBook}
        />
      </VStack>
    </MainLayout>
  );
};
