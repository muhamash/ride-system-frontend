/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import
  {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { useMyToast } from "@/components/layouts/MyToast";
import
  {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEditDriverByIdMutation, useEditUserByIdMutation } from "@/redux/features/api/admin.api";
import { authApi } from "@/redux/features/api/auth.api";
import { useAppDispatch } from "@/redux/hooks";

// Base schema for common fields
const baseSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
});

// Schema for DRIVER (name + vehicleInfo)
const driverSchema = baseSchema.extend({
  vehicleInfo: z.object({
    license: z.string().min(3, { message: "License must be at least 3 characters" }),
    model: z.string().min(2, { message: "Model must be at least 2 characters" }),
    plateNumber: z.string().min(2, { message: "Plate number must be at least 2 characters" }),
  }),
});

// Schema for RIDER (name only)
const riderSchema = baseSchema;

interface IEditUserDialog {
  user: any;
}

export default function EditUserDialog({ user }: IEditUserDialog) {
  const { showToast } = useMyToast();

  const schema = user?.role === "DRIVER" ? driverSchema : riderSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      vehicleInfo:
        user?.role === "DRIVER"
          ? {
              license: user?.vehicleInfo?.license || "",
              model: user?.vehicleInfo?.model || "",
              plateNumber: user?.vehicleInfo?.plateNumber || "",
            }
          : undefined,
    },
  });

  // Track toggles
  const [editName, setEditName] = React.useState(false);
  const [ editVehicle, setEditVehicle ] = React.useState( false );
  const [ editUser ] = useEditUserByIdMutation();
  const [ editVehicleInfo ] = useEditDriverByIdMutation();
  const dispatch = useAppDispatch();

  const onSubmit = async ( data: z.infer<typeof schema> ) =>
  {
    const updates: any = {};
    if ( editName ) updates.name = data.name;
    if ( editVehicle && data.vehicleInfo ) updates.vehicleInfo = data.vehicleInfo;

    if ( !Object.keys( updates ).length )
    {
      showToast( { message: "No changes to save!", type: "warning" } );
      return;
    }

    console.log( "Updating user with:", updates );

    try
    {
      if ( editName )
      {
        // console.log(user)
        await editUser( {
          id: user?._id,
          payload: updates
        } ).unwrap();

        showToast( {
          message: `User "${ data.name }" updated successfully!`,
          type: "success",
        } );

        setEditName( false );
      }
      
      if ( editVehicle )
      {
        // console.log()
        await editVehicleInfo( {
          id: user?.driver?._id,
          payload: updates?.vehicleInfo
        } ).unwrap();

        showToast( {
          message: `Vehicle  updated successfully!`,
          type: "success",
        } );
        setEditVehicle( false );
      }
    }
    catch ( error: unknown )
    {
      showToast( {
        message: error?.message || error?.data?.message,
        type: "error",
      } );
    }
    finally
    {
      dispatch( authApi.util.resetApiState() );
    }
  };

  return (
    <Dialog className="p-3">
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onKeyDown={( e ) =>
      {
        if ( e.code === "Space" )
        {
          e.stopPropagation();
        }
      }} onInteractOutside={( e ) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            {user?.role === "DRIVER"
              ? "Update driver's name and vehicle information."
              : "Update rider's name."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          {/* Name Switch */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span>Edit Name</span>
            <div
              className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 ${ editName ? "bg-cyan-600" : "bg-gray-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${ editName ? "translate-x-5" : ""
                  }`}
              ></div>
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={editName}
              onChange={() =>
              {
                setEditName( !editName );
                if ( !editName ) setEditVehicle( false ); // turn off vehicle switch
              }}
            />
          </label>

          {user?.role === "DRIVER" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <span>Edit Vehicle Info</span>
              <div
                className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 ${ editVehicle ? "bg-cyan-600" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${ editVehicle ? "translate-x-5" : ""
                    }`}
                ></div>
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={editVehicle}
                onChange={() =>
                {
                  setEditVehicle( !editVehicle );
                  if ( !editVehicle ) setEditName( false );
                }}
              />
            </label>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-6">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={( { field } ) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} disabled={!editName} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vehicle Info - Only for DRIVER */}
            {user?.role === "DRIVER" && editVehicle && (
              <>
                <FormField
                  control={form.control}
                  name="vehicleInfo.license"
                  render={( { field } ) => (
                    <FormItem>
                      <FormLabel>License</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter license" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleInfo.model"
                  render={( { field } ) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter model" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleInfo.plateNumber"
                  render={( { field } ) => (
                    <FormItem>
                      <FormLabel>Plate Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter plate number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="submit" disabled={!editName && !editVehicle}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
