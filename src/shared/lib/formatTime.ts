type FormatMode = "full" | "date";

/**
 * Форматирует ISO-строку времени с бэкенда в человекочитаемый формат.
 * @param isoString - строка вида "2026-04-26T09:57:25.085891Z"
 * @param mode - 'full' для "15.10.2026 09:54:52", 'date' для "15.10.2026"
 * @returns отформатированная строка или пустая строка при некорректном вводе
 */
export function formatDateTime(
  isoString: string,
  mode: FormatMode = "full",
): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "";

  const pad = (n: number): string => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const datePart = `${day}.${month}.${year}`;

  if (mode === "date") return datePart;

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${datePart} ${hours}:${minutes}:${seconds}`;
}
