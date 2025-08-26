/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, FlagIcon, TruckIcon } from "lucide-react";
import { useState } from "react";

type RideStatus = "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "COMPLETED";

const steps: { label: string; key: RideStatus; icon: JSX.Element }[] = [
  { label: "Accepted", key: "ACCEPTED", icon: <FlagIcon className="w-5 h-5" /> },
  { label: "Picked Up", key: "PICKED_UP", icon: <CheckCircleIcon className="w-5 h-5" /> },
  { label: "In Transit", key: "IN_TRANSIT", icon: <TruckIcon className="w-5 h-5" /> },
  { label: "Completed", key: "COMPLETED", icon: <CheckCircleIcon className="w-5 h-5" /> },
];

interface RideActionsProps {
  rideId: string;
}

export default function RideActionsWrapper({ rideId }: RideActionsProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const simulateApiCall = (stepLabel: string) => {
    return new Promise<void>((resolve) => {
      console.log(`Simulating API call for: ${stepLabel}`);
      setTimeout(() => resolve(), 800);
    });
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      await simulateApiCall(steps[currentStep].label);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === steps.length - 1) {
      // Final step - complete the ride
      await simulateApiCall(steps[currentStep].label);
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="p-6 border rounded-lg w-full bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-6 text-center">Ride Progress</h2>

      <div className="flex justify-between items-center mb-8 relative">

        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  status === "completed"
                    ? "bg-green-500 text-white"
                    : status === "current"
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {status === "completed" ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div
                className={`text-xs mt-2 font-medium ${
                  status === "completed" || status === "current"
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step descriptions */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Driver Assigned</span>
          <span className="text-sm font-medium">John D.</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Vehicle</span>
          <span className="text-sm font-medium">Toyota Camry (ABC-123)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Estimated Time</span>
          <span className="text-sm font-medium">15 min</span>
        </div>
      </div>

      {/* Next Step Button */}
      {currentStep < steps.length && (
        <Button
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? "Complete Ride" : "Next Step"}
        </Button>
      )}

      {currentStep === steps.length && (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-600 font-bold text-lg">Ride Completed</p>
          <Button 
            variant="outline" 
            className="mt-4"
            
          >
            View Details
          </Button>
        </div>
      )}

      
    </div>
  );
}