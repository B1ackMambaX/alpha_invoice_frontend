type Validator = (value: string) => string | undefined

export const required: Validator = (value) =>
  value?.trim() ? undefined : 'Обязательное поле'

export const minLength =
  (min: number): Validator =>
  (value) =>
    value && value.length >= min ? undefined : `Минимум ${min} символов`

export const isEmail: Validator = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : 'Введите корректный email'

export const composeValidators =
  (...validators: Validator[]): Validator =>
  (value) =>
    validators.reduce<string | undefined>(
      (error, validator) => error ?? validator(value),
      undefined,
    )
