/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from 'leaflet';

export interface Location
{
  name: string;
  lat: number;
  lng: number;
}

export interface RideDetails {
  distance: number;
  duration: number;
  price: number;
}

export interface IProps
{
    test?: string;  
  pickupLocation: Location;
  dropoffLocation: Location;
  pickupIcon: Icon;
  dropoffIcon: Icon;
  onMapClick: (e: any) => void;
}

export interface DropoffLocationInputProps {
  onSelect: (location: { lat: number; lng: number }) => void;
}