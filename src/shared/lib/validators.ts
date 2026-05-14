type Validator = (value: string) => string | undefined

export const required: Validator = (value) =>
  value?.trim() ? undefined : 'Обязательное поле'

export const minLength =
  (min: number): Validator =>
  (value) =>
    value && value.length >= min ? undefined : `Минимум ${min} символов`

export const isEmail: Validator = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Введите корректный email'

export const accountNumber: Validator = (value) =>
  /^\d{20}$/.test(value ?? '') ? undefined : 'Номер счёта должен содержать ровно 20 цифр'

export const inn: Validator = (value) =>
  !value || /^\d{12}$/.test(value) ? undefined : 'ИНН должен содержать ровно 12 цифр'

export const kpp: Validator = (value) =>
  !value || /^\d{9}$/.test(value) ? undefined : 'КПП должен содержать ровно 9 цифр'

export const composeValidators =
  (...validators: Validator[]): Validator =>
  (value) =>
    validators.reduce<string | undefined>(
      (error, validator) => error ?? validator(value),
      undefined,
    )
