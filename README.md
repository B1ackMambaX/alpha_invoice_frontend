# Invoice Frontend

React + TypeScript + Vite проект, построенный по методологии **Feature-Sliced Design (FSD)**.

---

## Стек

| Инструмент | Назначение |
|---|---|
| React 19 | UI |
| TypeScript | Типизация |
| Vite | Сборка |
| Redux Toolkit + RTK Query | Стейт-менеджмент и запросы к API |
| React Router 7 | Маршрутизация |
| Emotion | CSS-in-JS стилизация |

---

## Структура проекта

```
src/
├── app/                        # Инициализация приложения
│   ├── providers/
│   │   ├── store/              # Redux store, типы, хуки
│   │   ├── router/             # Конфигурация роутера
│   │   └── index.tsx           # Корневой компонент <App>
│   └── styles/
│       └── index.css           # Глобальные стили и CSS reset
│
├── pages/                      # Страницы (компонуют виджеты)
├── widgets/                    # Самостоятельные блоки UI (компонуют фичи и сущности)
├── features/                   # Пользовательские сценарии (действия)
├── entities/                   # Бизнес-сущности (модели, API, UI)
└── shared/                     # Переиспользуемый код без бизнес-логики
    ├── api/                    # Базовый RTK Query клиент
    ├── config/                 # Переменные окружения
    ├── lib/                    # Утилиты и хелперы
    ├── types/                  # Общие TypeScript типы
    └── ui/                     # Переиспользуемые UI компоненты
```

---

## Слои FSD

FSD делит код на **6 слоёв** с жёстким правилом: каждый слой может импортировать только из слоёв **ниже** себя.

```
app → pages → widgets → features → entities → shared
```

### `shared`
Код без бизнес-логики, не знающий о предметной области. Используется всеми слоями.

- `api/` — базовый RTK Query клиент (`baseApi`), от которого наследуются все эндпоинты
- `config/` — константы и переменные окружения (`VITE_API_URL`)
- `lib/` — вспомогательные функции (форматирование дат, валидация и т.д.)
- `types/` — общие интерфейсы и типы (пагинация, ответы API)
- `ui/` — примитивные UI компоненты (Button, Input, Modal)

### `entities`
Бизнес-сущности: модели данных, их отображение и API эндпоинты.

Структура слайса:
```
entities/
└── invoice/
    ├── api.ts          # RTK Query эндпоинты (injectEndpoints)
    ├── model/
    │   ├── types.ts    # TypeScript интерфейсы сущности
    │   └── slice.ts    # Redux slice (если нужен локальный стейт)
    ├── ui/
    │   └── InvoiceCard.tsx
    └── index.ts        # Публичное API слайса
```

### `features`
Пользовательские сценарии, изменяющие состояние сущностей.

```
features/
└── create-invoice/
    ├── ui/
    │   └── CreateInvoiceForm.tsx
    ├── model/
    │   └── useCreateInvoice.ts
    └── index.ts
```

### `widgets`
Самодостаточные блоки интерфейса, компонующие фичи и сущности. Не имеют props — берут данные сами.

```
widgets/
└── invoice-list/
    ├── ui/
    │   └── InvoiceList.tsx
    └── index.ts
```

### `pages`
Страницы приложения. Только компонуют виджеты, минимум логики.

```
pages/
└── invoices/
    ├── ui/
    │   └── InvoicesPage.tsx
    └── index.ts
```

### `app`
Точка входа в приложение. Инициализирует провайдеры, роутер, глобальные стили.

---

## Правила импортов

| Откуда | Может импортировать |
|---|---|
| `app` | `pages`, `widgets`, `features`, `entities`, `shared` |
| `pages` | `widgets`, `features`, `entities`, `shared` |
| `widgets` | `features`, `entities`, `shared` |
| `features` | `entities`, `shared` |
| `entities` | `shared` |
| `shared` | ничего выше |

**Запрещено:** импортировать из слоя того же уровня или выше (cross-import между слайсами одного слоя).

Используй Path aliases для чистых импортов:

```ts
// Хорошо
import { InvoiceCard } from '@entities/invoice'
import { Button } from '@shared/ui'

// Плохо
import { InvoiceCard } from '../../entities/invoice'
```

---

## Публичное API слайса

Каждый слайс экспортирует только то, что нужно снаружи, через `index.ts`. Прямые импорты внутренних файлов запрещены.

```ts
// entities/invoice/index.ts
export type { Invoice } from './model/types'
export { InvoiceCard } from './ui/InvoiceCard'
export { useGetInvoicesQuery } from './api'
```

```ts
// Правильно
import { Invoice, InvoiceCard } from '@entities/invoice'

// Неправильно
import { InvoiceCard } from '@entities/invoice/ui/InvoiceCard'
```

---

## Добавление нового API эндпоинта

Эндпоинты создаются в соответствующем слайсе через `injectEndpoints`:

```ts
// entities/invoice/api.ts
import { baseApi } from '@shared/api'
import type { Invoice } from './model/types'

const invoiceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getInvoices: build.query<Invoice[], void>({
      query: () => '/invoices',
    }),
    getInvoiceById: build.query<Invoice, string>({
      query: (id) => `/invoices/${id}`,
    }),
    createInvoice: build.mutation<Invoice, Partial<Invoice>>({
      query: (body) => ({ url: '/invoices', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateInvoiceMutation,
} = invoiceApi
```

---

## Переменные окружения

Создай `.env` файл в корне проекта:

```env
VITE_API_URL=http://localhost:8000/api
```

Доступ к переменным через `@shared/config`:

```ts
import { API_URL } from '@shared/config'
```

---

## Path Aliases

| Alias | Путь |
|---|---|
| `@app/*` | `src/app/*` |
| `@pages/*` | `src/pages/*` |
| `@widgets/*` | `src/widgets/*` |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*` | `src/shared/*` |

---

## Хуки Redux

Используй типизированные хуки из `@app/providers/store` вместо стандартных:

```ts
import { useAppDispatch, useAppSelector } from '@app/providers/store'

const dispatch = useAppDispatch()
const data = useAppSelector((state) => state.someSlice.value)
```

---

## Запуск

```bash
# Установка зависимостей
npm install

# Режим разработки
npm run dev

# Сборка
npm run build

# Превью сборки
npm run preview
```
