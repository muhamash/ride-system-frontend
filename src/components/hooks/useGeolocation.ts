import { useEffect, useState } from "react";

export const useGeolocation = () =>
{
    const [ coords, setCoords ] = useState<{ lat: number; lng: number } | null>( null );

    useEffect( () =>
    {
        if ( !navigator.geolocation ) return;

        const watchId = navigator.geolocation.watchPosition(
            ( pos ) =>
            {
                setCoords( { lat: pos.coords.latitude, lng: pos.coords.longitude } );
            },
            ( err ) => console.error( "Geo error", err ),
            { enableHighAccuracy: true }
        );
      
        console.log(watchId)

        return () => navigator.geolocation.clearWatch( watchId );
    }, [] );

    console.log(coords)

    return coords;
};
