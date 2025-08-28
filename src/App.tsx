/* eslint-disable @typescript-eslint/no-unused-vars */
import { Outlet } from 'react-router';
import './App.css';
import { useContinuousLocation } from './components/hooks/useGeolocation';
import BaseLayout from './components/layouts/BaseLayout';
import { useUserDataQuery } from './redux/features/api/auth.api';

function App() {
  const { data } = useUserDataQuery();
  const userId = data?.data?._id || ""; 
  // console.log( data );
  const { coords, error, retry } = useContinuousLocation(userId);

  return (
    <BaseLayout>
      <Outlet />
    </BaseLayout>
  );
}

export default App;