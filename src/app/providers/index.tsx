import { Provider } from 'react-redux'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'
import { store } from './store'
import { AppRouter } from './router'

const system = createSystem(defaultConfig)

export const App = () => (
  <ChakraProvider value={system}>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </ChakraProvider>
)
