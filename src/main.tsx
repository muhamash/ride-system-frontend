import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import './index.css'
import { store } from './redux/store'
import { appRouter } from './routes/index.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter}>
      </RouterProvider>
       <Toaster position='top-right' />
    </Provider>
  </StrictMode>,
)
