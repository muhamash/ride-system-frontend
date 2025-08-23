import { useMyToast } from "@/components/layouts/MyToast";
import { Button } from "@/components/ui/button";
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
import
    {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "@/components/ui/select";
import { UserRole } from "@/constants/userRole";
import { cn } from "@/lib/utils";
import { useRegisterMutation } from "@/redux/features/api/auth.api";
import { registrationSchema, type RegistrationSchemaType } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

export default function RegistrationForm ()
{
    const location = useLocation();
    const [ role, setRole ] = useState<UserRole>( location?.state ?? UserRole.RIDER );

    const form = useForm<RegistrationSchemaType>( {
        resolver: zodResolver( registrationSchema ),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: role,
            vehicleInfo: {
                model: "",
                license: "",
                plateNumber: "",
            },
        },
        mode: "onSubmit"
    } );

    
    const [ register ] = useRegisterMutation();
    const { showToast, updateToast } = useMyToast();
    const navigate = useNavigate();

    useEffect( () =>
    {
        if ( form.watch( "role" ) !== UserRole.DRIVER )
        {
            form.setValue( "vehicleInfo", undefined ); 
        }
    }, [ form.watch( "role" ) ] );

    const onSubmit = async( data: RegistrationSchemaType ) =>
    {
        console.log( "SUBMIT CALLED" );
        console.log( data );
        const toastId = showToast( {
            message: "Trying to create a user..",
            type: "loading",
            autClose: false,
        } );

        try 
        {
            const res = await register( data );
            console.log(res.data)

            if ( res?.data?.statusCode === 201 )
            {
                updateToast(toastId, {
                    message: res?.data?.message,
                    type: "success"
                } );

                navigate("/login")
            }

            if ( res?.data?.statusCode !== 201 )
            {
                updateToast( toastId, {
                    message: res?.error?.data?.message,
                    type: "info"
                })
            }
        }
        catch ( error: unknown )
        {
            console.log( error );
            updateToast(toastId, {
                message: error?.data?.message || "Something went wrong!",
                type: "error"
            } );
        }
    };
    // console.log( "Errors:", form.formState.errors );

    return (
        <div
            className={cn(
                "flex flex-col gap-6",
                "bg-teal-100/20 backdrop-blur-md border border-gray-500 rounded-lg shadow-lg md:px-10 py-5 p-3"
            )}
        >
            <Form {...form}>
                <form className="flex flex-col gap-3" onSubmit={form.handleSubmit( onSubmit )}>
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirm Password */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Re-enter password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Role Selector */}
                    <FormField
                        control={form.control}
                        name="role"
                        render={( { field } ) => (
                            <FormItem>
                                <FormLabel>What is your role for this App?</FormLabel>
                                <Select
                                    onValueChange={( val: UserRole ) =>
                                    {
                                        field.onChange( val );
                                        setRole( val );
                                    }}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserRole.RIDER}>Rider</SelectItem>
                                        <SelectItem value={UserRole.DRIVER}>Driver</SelectItem>
                                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Vehicle Info - only if DRIVER */}
                    {role === UserRole.DRIVER && (
                        <div className="space-y-3">
                            <FormField
                                control={form.control}
                                name="vehicleInfo.model"
                                render={( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Vehicle Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Toyota Prius" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicleInfo.license"
                                render={( { field } ) => (
                                    <FormItem>
                                        <FormLabel>License</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., DHA-1234" {...field} />
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
                                        <FormLabel>Vehicle Plate Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., DHA-1234" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <Button type="submit" className="w-full cursor-pointer my-5 bg-chart-5">
                        Register
                    </Button>
                </form>
            </Form>

            <div className="text-foreground text-center text-xs text-balance">
                Already have an account?
                <Link className="font-bold underline text-blue-800 px-2" to="/login">
                    Login
                </Link>
            </div>
        </div>
    );
}
