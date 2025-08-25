/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
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

  // Dynamic schema selection
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

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("User Data:", data);
    setTimeout(() => {
      showToast({
        message: `User "${data.name}" updated successfully!`,
        type: "success",
      });
    }, 500);
  };

  return (
    <Dialog className="p-3">
      <DialogTrigger asChild>
        <p>Edit</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            {user?.role === "DRIVER"
              ? "Update driver's name and vehicle information."
              : "Update rider's name."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vehicle Info - Only for DRIVER */}
            {user?.role === "DRIVER" && (
              <>
                <FormField
                  control={form.control}
                  name="vehicleInfo.license"
                  render={({ field }) => (
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
                  render={({ field }) => (
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
                  render={({ field }) => (
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
