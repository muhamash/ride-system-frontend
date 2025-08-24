/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RideOption {
  id: string;
  name: string;
  price: string;
}

interface RideSummaryProps {
  pickupLocation: string;
  destination: string;
  rideType: string;
  paymentMethod: string;
  rideOptions: RideOption[];
  rideData?: any;
}

export default function RideSummary({
  pickupLocation,
  destination,
  rideType,
  paymentMethod,
  rideData,
  rideOptions
}: RideSummaryProps )
{
  console.log(rideData?.fare[rideType], rideType)
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle>Ride Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium">{pickupLocation || "Not selected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium">{destination || "Not selected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ride Type:</span>
            <span className="font-medium">
              {rideOptions.find( o => o.id === rideType )?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment:</span>
            <span className="font-medium capitalize">{paymentMethod}</span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between text-lg font-bold">
              <span>Estimated Price:</span>
              <span className="text-blue-600">
                {
                  ( () =>
                  {
                    if ( rideData?.fare )
                    {
                      return rideData?.fare[rideType].toFixed(2)
                    }
                    return rideOptions.find( o => o.id === rideType )?.price;
                  } )()
                }
                {" "}Tk


              </span>
            </div>
            <p className="text-purple-600 font-mono">Disclaimer: This price is just a show off! it has not any value! i am calculating mock pricing range!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}