import { LoadPeriod, LoadStatus, LoadType } from "@entities/data-load-log";

export const periodDictionary = {
  [LoadPeriod.DAY]: "1 день",
  [LoadPeriod.HOUR]: "1 час",
  [LoadPeriod.WEEK]: "1 неделя",
  [LoadPeriod.MONTH]: "1 месяц",
  [LoadPeriod.THREE_MONTHS]: "3 месяца",
};

export const statusDictionary = {
  [LoadStatus.IN_PROGRESS]: "В процессе",
  [LoadStatus.SUCCESS]: "Успешно",
  [LoadStatus.ERROR]: "Ошибка",
};

export const typeDictionary = {
  [LoadType.STANDARD]: "Стандартная",
  [LoadType.BY_DATE]: "По дате",
  [LoadType.BY_ACCOUNT]: "По счету",
};
