import { Form } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { LuDownload } from 'react-icons/lu';
import { DatePickerField } from '@shared/ui';
import type { ExportParams } from '@entities/report';

type Props = {
  title: string;
  description: string;
  filename: (params: ExportParams) => string;
  onExport: (params: ExportParams) => Promise<Blob>;
};

export const ExportReportCard = ({ title, description, filename, onExport }: Props) => {
  const handleSubmit = async (values: ExportParams, form: { reset: () => void }) => {
    if (!values.date_from || !values.date_to) {
      return { [FORM_ERROR]: 'Заполните обе даты' };
    }
    if (values.date_from > values.date_to) {
      return { [FORM_ERROR]: 'Дата «от» не может быть больше даты «до»' };
    }

    try {
      const blob = await onExport(values);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename(values);
      a.click();
      URL.revokeObjectURL(url);
      form.reset();
    } catch {
      return { [FORM_ERROR]: 'Ошибка при формировании отчёта' };
    }
  };

  return (
    <Box bg="white" borderRadius="12px" p={6} borderWidth="1px" borderColor="border">
      <Heading size="md" mb={1}>{title}</Heading>
      <Text fontSize="sm" color="fg.muted" mb={5}>{description}</Text>

      <Form<ExportParams> onSubmit={handleSubmit}>
        {({ handleSubmit, submitting, submitError }) => (
          <form onSubmit={handleSubmit}>
            <Flex gap={4} align="flex-end" flexWrap="wrap">
              <Box minW="180px">
                <DatePickerField name="date_from" label="Дата от" />
              </Box>
              <Box minW="180px">
                <DatePickerField name="date_to" label="Дата до" />
              </Box>
              <Button type="submit" colorPalette="brand" loading={submitting}>
                <LuDownload />
                Скачать
              </Button>
            </Flex>
            <Box h="20px" mt={1}>
              <Text color="red.500" fontSize="sm">{submitError}</Text>
            </Box>
          </form>
        )}
      </Form>
    </Box>
  );
};
