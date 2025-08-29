/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CatIcon, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router';

export default function RideList({ride}: any) {
    return (
        <Card key={ride._id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col gap-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {ride.pickUpLocation?.address}
                </CardTitle>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-red-600" /> {ride.dropOffLocation?.address}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 h-full justify-between">
                <div className="flex flex-wrap gap-2 items-center justify-between text-gray-700">
                    <div className="flex items-center gap-1">
                        <CatIcon className="h-4 w-4 text-green-600" /> {ride.fare.toFixed( 2 )} tk
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" /> {new Date( ride.requestedAt ).toLocaleString()}
                    </div>
                </div>
                <div className="flex w-full justify-between items-center pt-3">
                    <div
                        className={`text-sm font-semibold px-2 py-1 inline-block rounded ${ ride.status === "REQUESTED"
                            ? "bg-yellow-100 text-yellow-800"
                            : ride.status === "IN_TRANSIT"
                                ? "bg-blue-100 text-blue-800"
                                : ride.status === "ACCEPTED"
                                    ? "bg-violet-100 text-sky-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                    >
                        {ride.status.replace( "_", " " )}
                    </div>
                    <Link
                        to={`/ride/ride-info/${ ride._id }`}
                        className="px-3 py-1 text-sm font-mono bg-sky-200 rounded-md shadow"
                    >
                        View
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
