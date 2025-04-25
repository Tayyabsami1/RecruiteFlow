import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './App/Store.js'
import './index.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
    <Provider store={store}>
    <App />
    </Provider>
    </MantineProvider>
  </StrictMode>,
)
