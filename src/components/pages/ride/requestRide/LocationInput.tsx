/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDebounce } from "@/components/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchLocationMutation } from "@/redux/features/api/locationService.api";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface Location {
  id: number;
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

interface LocationInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (location: Location) => void;
  locations?: Location[]; 
  icon: React.ReactNode;
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function LocationInput({
  id,
  label,
  value,
  onChange,
  onLocationSelect,
  locations = [],
  icon,
  inputRef,
}: LocationInputProps) {
    const [ showSuggestions, setShowSuggestions ] = useState( false );
    const [ filteredSuggestions, setFilteredSuggestions ] = useState<Location[]>( locations );

    const debouncedValue = useDebounce( value, 500 );
    const [ searchLocation ] = useSearchLocationMutation();
    // console.log(showSuggestions, filteredSuggestions, debouncedValue)

    useEffect( () =>
    {
        const fetchLocations = async () =>
        {
            if ( !debouncedValue )
            {
                setFilteredSuggestions( locations );
                return;
            }

            try
            {
                const searchResult: any = await searchLocation( { query_text: debouncedValue } ).unwrap();

                if ( searchResult?.statusCode === 200 && Array.isArray( searchResult.data ) )
                {
                    const mappedLocations: Location[] = searchResult.data.map( ( loc: any ) => ( {
                        id: loc.place_id,
                        name: loc.address,
                        address: loc.address,
                        coords: { lat: loc.lat, lng: loc.lon },
                    } ) );
            
                    // console.log( mappedLocations, searchResult.debouncedValue )

                    setFilteredSuggestions( mappedLocations );
                } else
                {
                    setFilteredSuggestions( [] );
                }
            } catch ( err )
            {
                setFilteredSuggestions( [] );
            }
        };

        fetchLocations();
    }, [ debouncedValue, searchLocation, locations ] );

    return (
        <div className="space-y-2 relative">
            <Label htmlFor={id} className="flex items-center gap-2">
                {icon}
                {label}
            </Label>
            <div className="relative" ref={inputRef}>
                <Input
                    id={id}
                    placeholder={`Enter ${ label.toLowerCase() }`}
                    value={value}
                    onChange={( e ) => onChange( e.target.value )}
                    onFocus={() => setShowSuggestions( true )}
                    className="pr-8"
                />
                {value && (
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => onChange( "" )}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredSuggestions.length > 0 ? (
                            filteredSuggestions.map( ( location ) => (
                                <div
                                    key={location.id}
                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() =>
                                    {
                                        onLocationSelect( location );
                                        setShowSuggestions( false );
                                    }}
                                >
                                    <div className="font-medium">{location.name}</div>
                                    <div className="text-sm text-gray-600">{location.address}</div>
                                </div>
                            ) )
                        ) : (
                            <div className="px-4 py-3 text-gray-500">No locations found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}