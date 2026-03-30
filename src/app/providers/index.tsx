import { Provider } from 'react-redux'
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import { store } from './store'
import { AppRouter } from './router'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: { value: '#FF0000' },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid:      { value: '{colors.brand}' },
          contrast:   { value: '#ffffff' },
          fg:         { value: '{colors.brand}' },
          muted:      { value: '{colors.brand}' },
          subtle:     { value: '{colors.brand}' },
          emphasized: { value: '{colors.brand}' },
          focusRing:  { value: '{colors.brand}' },
        },
      },
    },
  },
})

const system = createSystem(defaultConfig, config)

export const App = () => (
  <ChakraProvider value={system}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </ChakraProvider>
)
