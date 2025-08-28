import { Button } from "@/components/ui/button";
import { Badge } from "lucide-react";

export function RideCard({ ride, onAccept, onCancel }: any) {
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
      <div>
        <p className="text-lg font-semibold">{ride.passengerName}</p>
        <p className="text-sm text-gray-700">{ride.pickup} <span className="text-xl text-rose-700 px-2">→</span> {ride.dropoff}</p>
        <p className="text-sm">Fare: ৳{ride.fare}</p>
        
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="secondary">{ride.status}</Badge>
        <Button onClick={() => onAccept(ride.id)}>Accept</Button>
        <Button variant="destructive" onClick={() => onCancel(ride.id)}>Cancel</Button>
      </div>
    </div>
  );
}