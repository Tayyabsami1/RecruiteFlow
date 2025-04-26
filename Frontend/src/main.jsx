import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './App/Store.js'
import './index.css'
import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';

// Create a custom theme that preserves existing styles
const theme = createTheme({
  respectReducedMotion: true,
  cursorType: 'pointer',
  defaultRadius: '4px',
  components: {
    Paper: {
      styles: {
        root: {
          backgroundColor: 'transparent',
        }
      }
    }
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider withNormalizeCSS={false} inheritColorScheme theme={theme}>
    <Provider store={store}>
    <App />
    </Provider>
    </MantineProvider>
  </StrictMode>,
)
