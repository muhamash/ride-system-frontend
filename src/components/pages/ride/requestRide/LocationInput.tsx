import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import React from "react";
import type { IProps } from "./types";


const LocationInput: React.FC<IProps> = ({ value, suggestions, onChange, onSelect, text }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {text}
      </label>
      <Command className="border rounded-lg shadow-sm">
        <CommandInput
          placeholder="Search dropoff location..."
          value={value}
          onValueChange={(val) => {
            onChange(val);
            setOpen(val.length > 0);
          }}
        />
        {open && (
          <CommandList>
            <CommandGroup>
              {suggestions.length > 0 ? (
                suggestions.map((location, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => {
                      onSelect(location);
                      setOpen(false); // closes dropdown after selection
                    }}
                  >
                    {location.name}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No results found.</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
};

export default LocationInput;
