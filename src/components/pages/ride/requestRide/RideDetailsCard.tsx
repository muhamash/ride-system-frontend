import { Clock, DollarSign, Navigation } from 'lucide-react';
import React from 'react';
import type { RideDetails } from './types';

const RideDetailsCard: React.FC<{ rideDetails: RideDetails }> = ({ rideDetails }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h3 className="font-medium text-gray-800 mb-3">Ride Details</h3>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <Navigation size={20} className="text-blue-600 mx-auto" />
        <p className="text-sm text-gray-600 mt-1">Distance</p>
        <p className="font-semibold">{rideDetails.distance} km</p>
      </div>
      <div className="text-center">
        <Clock size={20} className="text-blue-600 mx-auto" />
        <p className="text-sm text-gray-600 mt-1">Duration</p>
        <p className="font-semibold">{rideDetails.duration} min</p>
      </div>
      <div className="text-center">
        <DollarSign size={20} className="text-blue-600 mx-auto" />
        <p className="text-sm text-gray-600 mt-1">Estimated Price</p>
        <p className="font-semibold">৳ {rideDetails.price}</p>
      </div>
    </div>
  </div>
);

export default RideDetailsCard;
