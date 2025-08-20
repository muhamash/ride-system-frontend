import { Outlet } from 'react-router'
import './App.css'
import BaseLayout from './components/layouts/BaseLayout'

function App() {

  return (
    <BaseLayout>
      <Outlet/>
    </BaseLayout>
  )
}

export default App
