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
  onSelect: (id: string) => void;
}

export default function RideTypeCard({ option, isSelected, onSelect }: RideTypeCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(option.id)}
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
          <div>{option.price}</div>
          <div>ETA: {option.eta}</div>
        </div>
      </CardContent>
    </Card>
  );
}