import { Outlet } from 'react-router';
import './App.css';
import { useContinuousLocation } from './components/hooks/useGeolocation';
import BaseLayout from './components/layouts/BaseLayout';
import { useUserDataQuery } from './redux/features/api/auth.api';

function App ()
{
  const { data } = useUserDataQuery();

  // console.log(data)
  useContinuousLocation(data?._id);

  return (
    <BaseLayout>
      <Outlet/>
    </BaseLayout>
  )
}

export default App
