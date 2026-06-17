import { Field, type FieldValidator } from "react-final-form";
import {
  DatePicker,
  FieldRoot,
  FieldLabel,
  FieldErrorText,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { parseDate } from "@internationalized/date";

interface DatePickerFieldProps {
  name: string;
  label: string;
  validate?: FieldValidator<string>;
}

export const DatePickerField = ({ name, label, validate }: DatePickerFieldProps) => (
  <Field name={name} validate={validate}>
    {({ input, meta }) => {
      const isInvalid = meta.touched && !!meta.error;

      const dateValue = input.value ? [parseDate(input.value as string)] : [];

      return (
        <FieldRoot invalid={isInvalid}>
          <FieldLabel>{label}</FieldLabel>
          <DatePicker.Root
            value={dateValue}
            onValueChange={(details) => {
              const iso = details.value[0]?.toString() ?? "";
              input.onChange(iso);
            }}
            onBlur={input.onBlur}
            locale="ru-RU"
            startOfWeek={1}
          >
            <DatePicker.Control>
              <DatePicker.Context>
                {(api) => (
                  <DatePicker.Trigger asChild>
                    <Input
                      w="full"
                      h="10"
                      borderRadius="16px"
                      type="text"
                      readOnly
                      cursor="pointer"
                      placeholder="Выберите дату"
                      value={
                        api.value[0]
                          ? api.value[0]
                              .toDate("UTC")
                              .toLocaleDateString("ru-RU")
                          : ""
                      }
                      onChange={() => {}}
                    />
                  </DatePicker.Trigger>
                )}
              </DatePicker.Context>
            </DatePicker.Control>
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
                                    <DatePicker.TableCell
                                      key={j}
                                      value={month.value}
                                    >
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
                                  <DatePicker.TableCell
                                    key={j}
                                    value={year.value}
                                  >
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
          {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
        </FieldRoot>
      );
    }}
  </Field>
);
