/* eslint-disable @typescript-eslint/no-unused-vars */
import { Outlet } from 'react-router';
import './App.css';
import { useContinuousLocation } from './components/hooks/useGeolocation';
import BaseLayout from './components/layouts/BaseLayout';
import { useUserDataQuery } from './redux/features/api/auth.api';

function App() {
  const { data } = useUserDataQuery();
  const userId = data?.data?._id || ""; 
  // console.log( userId );
  const { coords, error, retry } = useContinuousLocation(userId);

  return (
    <BaseLayout>
      {/* <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <>
            {coords ? (
              <div className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 shadow-md w-full max-w-md text-center">
                <h2 className="text-lg font-semibold">Tracking Location</h2>
                <p className="mt-2">
                  Lat: {coords.lat}, Lng: {coords.lng}
                </p>
                <p className="text-sm mt-1 text-gray-600">{coords.address}</p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 shadow-md w-full max-w-md text-center">
                <p className="text-lg font-semibold">No location data yet.</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800 shadow-md w-full max-w-md text-center">
                <p className="font-semibold">{error}</p>
                <button
                  onClick={retry}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition"
                >
                  Retry Location Access
                </button>
              </div>
            )}
          </>
      </div> */}
      <Outlet />
    </BaseLayout>
  );
}

export default App;