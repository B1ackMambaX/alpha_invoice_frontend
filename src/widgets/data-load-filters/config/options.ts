import {
  LoadPeriod,
  LoadStatus,
  LoadType,
  periodDictionary,
  statusDictionary,
  typeDictionary,
} from "@entities/data-load-log";

export const PERIOD_OPTIONS: { value: LoadPeriod; label: string }[] = [
  { value: LoadPeriod.HOUR, label: periodDictionary[LoadPeriod.HOUR] },
  { value: LoadPeriod.DAY, label: periodDictionary[LoadPeriod.DAY] },
  { value: LoadPeriod.WEEK, label: periodDictionary[LoadPeriod.WEEK] },
  { value: LoadPeriod.MONTH, label: periodDictionary[LoadPeriod.MONTH] },
  { value: LoadPeriod.MONTH, label: periodDictionary[LoadPeriod.THREE_MONTHS] },
];

export const STATUS_OPTIONS: { value: LoadStatus; label: string }[] = [
  {
    value: LoadStatus.IN_PROGRESS,
    label: statusDictionary[LoadStatus.IN_PROGRESS],
  },
  { value: LoadStatus.SUCCESS, label: statusDictionary[LoadStatus.SUCCESS] },
  { value: LoadStatus.ERROR, label: statusDictionary[LoadStatus.ERROR] },
];

export const LOAD_TYPE_OPTIONS: { value: LoadType; label: string }[] = [
  { value: LoadType.STANDARD, label: typeDictionary[LoadType.STANDARD] },
  { value: LoadType.BY_DATE, label: typeDictionary[LoadType.BY_DATE] },
  { value: LoadType.BY_ACCOUNT, label: typeDictionary[LoadType.BY_ACCOUNT] },
];
