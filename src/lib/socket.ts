import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () =>
{
    if ( !socket )
    {
        socket = io( process.env.NEXT_PUBLIC_API_URL!, {
            transports: [ "websocket" ],
            withCredentials: true,
        } );
    }
    
    console.log( socket );
    
    return socket;
};

export const getSocket = () => socket;