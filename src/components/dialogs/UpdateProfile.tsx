/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useMyToast } from "@/components/layouts/MyToast";
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
import { useEditUserByIdMutation } from "@/redux/features/api/admin.api";
import { authApi } from "@/redux/features/api/auth.api";
import { useAppDispatch } from "@/redux/hooks";

const nameSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(5, "Enter current password"),
    newPassword: z.string().min(5, "New password must be at least 5 chars"),
    confirmPassword: z.string().min(5, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface IUserModalProps {
  user: any;
}

export default function UpdateProfileModal({ user }: IUserModalProps) {
  const { showToast } = useMyToast();

  const nameForm = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: user.name || "" },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  } );
  
  const [ editUser ] = useEditUserByIdMutation();
  const dispatch = useAppDispatch();

  const onSubmitName = async ( data: z.infer<typeof nameSchema> ) =>
  {
    try
    {
      console.log( "Update name:", data, user );

      

      await editUser( {
        id: user?._id,
        payload: data
      } ).unwrap();

      dispatch( authApi.util.resetApiState() );
      showToast( { message: `Name updated to "${ data.name }"`, type: "success" } );
    }
    catch ( error: unknown )
    {
      showToast( { message: error?.message || error?.data?.message, type: "error" } );
    }
    
  };

  const onSubmitPassword = async ( data: z.infer<typeof passwordSchema> ) =>
  {
    try
    {
      console.log( "Update :", data, user );

      const payload = { 
          newPassword: data.newPassword,
          oldPassword: data.oldPassword
       }
      
      await editUser( {
        id: user?._id,
        payload
      } ).unwrap();

      dispatch( authApi.util.resetApiState() );
      showToast( { message: `Password updated`, type: "success" } );
    }
    catch ( error: unknown )
    {
      showToast( { message: error?.message || error?.data?.message, type: "error" } );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-600 hover:bg-orange-700 text-white">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your name or password securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Name Update */}
          <Form {...nameForm}>
            <form onSubmit={nameForm.handleSubmit(onSubmitName)} className="space-y-4">
              <FormField
                control={nameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  Save Name
                </Button>
              </DialogFooter>
            </form>
          </Form>

          {/* Password Update */}
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="New password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Update Password
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}