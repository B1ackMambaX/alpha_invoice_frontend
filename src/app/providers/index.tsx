import { Provider } from 'react-redux'
import { store } from './store'
import { AppRouter } from './router'

export const App = () => (
  <Provider store={store}>
    <AppRouter />
  </Provider>
)
