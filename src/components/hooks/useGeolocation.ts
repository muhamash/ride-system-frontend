import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useContinuousLocation = ( userId: string ) =>
{
    const [ coords, setCoords ] = useState<{ lat: number; lng: number; address?: string } | null>( null );
    const watchIdRef = useRef<number | null>( null );
    const socketRef = useRef<Socket | null>( null );

    const fetchAddress = async ( lat: number, lng: number ) =>
    {
        try
        {
            const res = await axios.get( "https://nominatim.openstreetmap.org/reverse", {
                params: { format: "json", lat, lon: lng },
            } );
            console.log(res)
            return res.data.display_name;
        }
        catch ( err )
        {
            console.error( "Reverse geocode error:", err );
            return "";
        }
    };

    useEffect( () =>
    {
        // Connect to WebSocket
        socketRef.current = io( "http://localhost:3000" ); 

        if ( !navigator.geolocation ) return console.error( "Geolocation not supported" );

        watchIdRef.current = navigator.geolocation.watchPosition(
            async ( pos ) =>
            {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const address = await fetchAddress( lat, lng );

                const newCoords = { lat, lng, address };
                setCoords( newCoords );

                console.log(newCoords)
                // Emit location via Socket.IO
                socketRef.current?.emit( "update-location", {
                    userId,
                    coordinates: [ lng, lat ],
                    address,
                } );
            },
            ( err ) => console.error( "Geo error", err ),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        // socketRef.on( "user-location-updated", ( data ) =>
        // {
        //     console.log( "Other user's location:", data );
        // } );

        return () =>
        {
            if ( watchIdRef.current !== null ) navigator.geolocation.clearWatch( watchIdRef.current );
            socketRef.current?.disconnect();
        };
    }, [ userId ] );

    return coords;
};