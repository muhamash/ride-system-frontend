/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { DRIVER_STATUS } from "./page";

export function DriverInfo({ driverData, driverStatus, toggleAvailability }: any) {
  return (
    <div className="flex flex-col gap-2">
      <p>Name: {driverData?.data?.name}</p>
      <p>Email: {driverData?.data?.email}</p>
      <p>Driver Status: {driverStatus}</p>
      <p>User Status: {driverData?.data?.isOnline ? "ONLINE" : "OFFLINE"}</p>
      <div className="flex items-center gap-3 mt-2">
        <span>Status: </span>
        <Button
          variant={driverStatus === DRIVER_STATUS.AVAILABLE ? "default" : "outline"}
          onClick={toggleAvailability}
          disabled={[DRIVER_STATUS.NOTAPPROVED, DRIVER_STATUS.RIDING, DRIVER_STATUS.SUSPENDED].includes(driverStatus)}
        >
          {driverStatus === DRIVER_STATUS.AVAILABLE ? "Available" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}