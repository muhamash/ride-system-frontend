/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";

interface RideOption {
  id: string;
  name: string;
  price: string;
  eta: string;
  icon: React.ReactNode;
}

interface RideTypeCardProps {
  option: RideOption;
  isSelected: boolean;
  onSelect: ( id: string ) => void;
  rideTypesData: any;
}

export default function RideTypeCard ( { option, isSelected, rideTypesData, onSelect }: RideTypeCardProps )
{
  // console.log(rideTypesData)
  return (
    <Card
      className={`cursor-pointer transition-all ${ isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-gray-300"
        }`}
      onClick={() => onSelect( option.id )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {option.icon}
            <span className="font-medium">{option.name}</span>
          </div>
          {isSelected && (
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          )}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          <div>
            {rideTypesData?.fare
              ? `Fare: ৳${ rideTypesData.fare[ option.id ].toFixed( 2 ) }`
              : option.price}
          </div>
          <div>
            ETA: {rideTypesData?.duration
              ? ( () =>
              {
                const totalSeconds = Math.round( rideTypesData.duration );
                const minutes = Math.floor( totalSeconds / 60 );
                const seconds = totalSeconds % 60;
                return `${ minutes } min ${ seconds } sec`;
              } )()
              : option.eta}
          </div>

        </div>

      </CardContent>
    </Card>
  );
}