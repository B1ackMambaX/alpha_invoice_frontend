import { Flex, DatePicker, Input, IconButton } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { parseDate } from "@internationalized/date";

export function DateFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (iso: string | undefined) => void;
}) {
  const dateValue = value ? [parseDate(value)] : [];

  return (
    <DatePicker.Root
      value={dateValue}
      onValueChange={(details) => {
        const iso = details.value[0]?.toString() ?? undefined;
        onChange(iso || undefined);
      }}
      locale="ru-RU"
      startOfWeek={1}
    >
      <Flex align="center" position="relative">
        <DatePicker.Control>
          <DatePicker.Context>
            {(api) => (
              <DatePicker.Trigger asChild>
                <Input
                  w="160px"
                  h="9"
                  borderRadius="12px"
                  type="text"
                  readOnly
                  cursor="pointer"
                  background="white"
                  placeholder={label}
                  borderColor="transparent"
                  value={
                    api.value[0]
                      ? api.value[0].toDate("UTC").toLocaleDateString("ru-RU")
                      : ""
                  }
                  onChange={() => {}}
                />
              </DatePicker.Trigger>
            )}
          </DatePicker.Context>
        </DatePicker.Control>
        {value && (
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Сбросить дату"
            onClick={() => onChange(undefined)}
            position="absolute"
            right="0"
            _hover={{
              backgroundColor: "transparent",
            }}
          >
            <LuX />
          </IconButton>
        )}
      </Flex>
      <DatePicker.Positioner>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Context>
              {(api) => (
                <>
                  <DatePicker.ViewControl>
                    <DatePicker.PrevTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        ‹
                      </IconButton>
                    </DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        <DatePicker.RangeText />
                      </IconButton>
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        ›
                      </IconButton>
                    </DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableHead>
                      <DatePicker.TableRow>
                        {api.weekDays.map((wd, i) => (
                          <DatePicker.TableHeader key={i}>
                            {wd.short}
                          </DatePicker.TableHeader>
                        ))}
                      </DatePicker.TableRow>
                    </DatePicker.TableHead>
                    <DatePicker.TableBody>
                      {api.weeks.map((week, i) => (
                        <DatePicker.TableRow key={i}>
                          {week.map((day, j) => (
                            <DatePicker.TableCell key={j} value={day}>
                              <DatePicker.TableCellTrigger asChild>
                                <IconButton variant="ghost" size="sm">
                                  {day.day}
                                </IconButton>
                              </DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          ))}
                        </DatePicker.TableRow>
                      ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.Context>
          </DatePicker.View>
          <DatePicker.View view="month">
            <DatePicker.Context>
              {(api) => (
                <>
                  <DatePicker.ViewControl>
                    <DatePicker.PrevTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        ‹
                      </IconButton>
                    </DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        <DatePicker.RangeText />
                      </IconButton>
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        ›
                      </IconButton>
                    </DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableBody>
                      {api
                        .getMonthsGrid({ columns: 4, format: "short" })
                        .map((row, i) => (
                          <DatePicker.TableRow key={i}>
                            {row.map((month, j) => (
                              <DatePicker.TableCell key={j} value={month.value}>
                                <DatePicker.TableCellTrigger asChild>
                                  <IconButton variant="ghost" size="sm">
                                    {month.label}
                                  </IconButton>
                                </DatePicker.TableCellTrigger>
                              </DatePicker.TableCell>
                            ))}
                          </DatePicker.TableRow>
                        ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.Context>
          </DatePicker.View>
          <DatePicker.View view="year">
            <DatePicker.Context>
              {(api) => (
                <>
                  <DatePicker.ViewControl>
                    <DatePicker.PrevTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        ‹
                      </IconButton>
                    </DatePicker.PrevTrigger>
                    <DatePicker.ViewTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        <DatePicker.RangeText />
                      </IconButton>
                    </DatePicker.ViewTrigger>
                    <DatePicker.NextTrigger asChild>
                      <IconButton variant="ghost" size="sm">
                        ›
                      </IconButton>
                    </DatePicker.NextTrigger>
                  </DatePicker.ViewControl>
                  <DatePicker.Table>
                    <DatePicker.TableBody>
                      {api.getYearsGrid({ columns: 4 }).map((row, i) => (
                        <DatePicker.TableRow key={i}>
                          {row.map((year, j) => (
                            <DatePicker.TableCell key={j} value={year.value}>
                              <DatePicker.TableCellTrigger asChild>
                                <IconButton variant="ghost" size="sm">
                                  {year.label}
                                </IconButton>
                              </DatePicker.TableCellTrigger>
                            </DatePicker.TableCell>
                          ))}
                        </DatePicker.TableRow>
                      ))}
                    </DatePicker.TableBody>
                  </DatePicker.Table>
                </>
              )}
            </DatePicker.Context>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </DatePicker.Root>
  );
}
