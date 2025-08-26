/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMyToast } from "@/components/layouts/MyToast";
import { Button } from "@/components/ui/button";
import { useCompleteRideMutation, useInTransitRideMutation, usePickUpRideMutation } from "@/redux/features/api/ride.api"; // import your mutations
import { CheckCircleIcon, FlagIcon, TruckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type RideStatus = "ACCEPTED" | "PICKED_UP" | "IN_TRANSIT" | "COMPLETED";

const steps: { label: string; key: RideStatus; icon: JSX.Element }[] = [
  { label: "Accepted", key: "ACCEPTED", icon: <FlagIcon className="w-5 h-5" /> },
  { label: "Picked Up", key: "PICKED_UP", icon: <CheckCircleIcon className="w-5 h-5" /> },
  { label: "In Transit", key: "IN_TRANSIT", icon: <TruckIcon className="w-5 h-5" /> },
  { label: "Completed", key: "COMPLETED", icon: <CheckCircleIcon className="w-5 h-5" /> },
];

interface RideActionsProps {
    ride: any;
    onRideUpdate?: () => void;
}

const getCurrentStepIndex = ( status: RideStatus ): number =>
{
    const index = steps.findIndex( ( s ) => s.key === status );

    if ( status === "COMPLETED" )
    {
        return steps.length - 1; 
    }

    return index;
};

export default function RideActionsWrapper ( { ride, onRideUpdate }: RideActionsProps )
{
    const [ currentStep, setCurrentStep ] = useState( getCurrentStepIndex( ride.status ) );
    
    

    console.log(ride.status)

    
    useEffect( () =>
    {
        setCurrentStep( getCurrentStepIndex( ride.status ) );
    }, [ ride.status ] );


    const navigate = useNavigate();
    console.log(ride)
  const [pickUpRide] = usePickUpRideMutation();
  const [inTransitRide] = useInTransitRideMutation();
  const [completeRide] = useCompleteRideMutation();

    const { showToast, updateToast } = useMyToast();

    const handleNext = async () =>
    {
        const currentStepKey = steps[ currentStep ].key;
        const toastId = showToast( { type: "info", message: `Processing "${ steps[ currentStep ].label }"...` } );

        try
        {
            if ( currentStepKey === "ACCEPTED" )
            {
                const res = await pickUpRide( { id: ride._id } ).unwrap();
                console.log( res );
            } else if ( currentStepKey === "PICKED_UP" )
            {
                await inTransitRide( { id: ride._id } ).unwrap();
            } else if ( currentStepKey === "IN_TRANSIT" )
            {
                await completeRide( { id: ride._id } ).unwrap();
            }

            setCurrentStep( currentStep + 1 );

            // Notify parent to refetch ride
            onRideUpdate?.();
            updateToast( toastId, { type: "success", message: `"${ steps[ currentStep ].label }" completed successfully!` } );

            if ( currentStep === steps.length - 1 )
            {
                navigate("/ride/check-ride-request")
            }
        } catch ( error: any )
        {
            console.error( "API error:", error );
            const errorMessage = error?.data?.message || error?.message || "Something went wrong!";
            updateToast( toastId, { type: "error", message: errorMessage } );
        }
    };

    

    const getStepStatus = ( index: number ) =>
    {
        if ( ride.status === "COMPLETED" )
        {
            // Mark all except last as completed
            if ( index < steps.length - 1 ) return "completed";
            if ( index === steps.length - 1 ) return "completed"; // or "final" if you want different style
        }

        if ( index < currentStep ) return "completed";
        if ( index === currentStep ) return "current";
        return "upcoming";
    };

    return (
        <div className="p-6 border rounded-lg w-full bg-white shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-center">Ride Progress</h2>

            <div className="flex justify-between items-center mb-8 relative">
                {steps.map( ( step, index ) =>
                {
                    const status = getStepStatus( index );
                    return (
                        <div key={step.key} className="flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${ status === "completed"
                                    ? "bg-green-500 text-white"
                                    : status === "current"
                                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {status === "completed" ? <CheckCircleIcon className="w-5 h-5" /> : step.icon}
                            </div>
                            <div
                                className={`text-xs mt-2 font-medium ${ status === "completed" || status === "current" ? "text-gray-900" : "text-gray-500"
                                    }`}
                            >
                                {step.label}
                            </div>
                        </div>
                    );
                } )}
            </div>

            {/* Ride Info */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Driver Assigned</span>
                    <span className="text-sm font-medium">{ride.driverUserName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Vehicle</span>
                    <span className="text-sm font-medium">
                        {ride.driver.vehicleInfo
                            ? `${ ride.driver.vehicleInfo.model } (${ ride.driver.vehicleInfo.plateNumber })`
                            : "Not Assigned"}
                    </span>
                </div>
        
            </div>

            {/* Next Step Button */}
            {ride.status !== "COMPLETED" && currentStep < steps.length - 1 && (
                <Button
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={handleNext}
                >
                    {currentStep === steps.length - 2 ? "Take cash!" : "Next Step"}
                </Button>
            )}

        </div>
    );
}
