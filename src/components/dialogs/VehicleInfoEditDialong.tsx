 
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
import { useEditDriverByIdMutation } from "@/redux/features/api/admin.api";
import { authApi } from "@/redux/features/api/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Loader2, Pencil } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMyToast } from "../layouts/MyToast";

// Define the form schema using Zod
const vehicleFormSchema = z.object( {
    license: z.string().min( 2, {
        message: "License must be at least 2 characters.",
    } ),
    model: z.string().min( 2, {
        message: "Model must be at least 2 characters.",
    } ),
    plateNumber: z.string().min( 2, {
        message: "Plate number must be at least 2 characters.",
    } ),
} );

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleEditModalProps {
  vehicleData?: VehicleFormValues;
  userId: string
}

// Default values for the form
const defaultValues: VehicleFormValues = {
    license: "",
    model: "",
    plateNumber: "",
};

export function VehicleEditModal({
  vehicleData = defaultValues,
  userId
}: VehicleEditModalProps) {
    const [ open, setOpen ] = useState( false );
    const [ isLoading, setIsLoading ] = useState( false );

    const form = useForm<VehicleFormValues>( {
        resolver: zodResolver( vehicleFormSchema ),
        defaultValues: vehicleData,
    } );

    React.useEffect( () =>
    {
        if ( open ) form.reset( vehicleData );
    }, [ open, vehicleData, form ] );

    const [ editVehicleInfo ] = useEditDriverByIdMutation();
    const dispatch = useAppDispatch();
    const { showToast } = useMyToast();
    
    async function handleSave(data: VehicleFormValues) {
        setIsLoading(true);
        try {

            console.log(data, userId)
            await editVehicleInfo( {
                id: userId,
                payload: data
            } ).unwrap();

            showToast( {
                message: `Vehicle  updated successfully!`,
                type: "success",
            } );

            setOpen(false);
        }
        catch ( error )
        {
            showToast( {
                message: error?.message || error?.data?.message,
                type: "error",
            } );
            console.error(error);
        }
        finally
        {
            setIsLoading( false );
            dispatch( authApi.util.resetApiState() );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                    <Pencil className="h-4 w-4 mr-2" />
                    {vehicleData?.license ? "Edit Vehicle" : "Add Vehicle"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        {vehicleData?.license ? "Edit Vehicle" : "Add New Vehicle"}
                    </DialogTitle>
                    <DialogDescription>
                        Update your vehicle information and save changes.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit( handleSave )} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="license"
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
                                name="plateNumber"
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
                        </div>

                        <FormField
                            control={form.control}
                            name="model"
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

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen( false )}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
