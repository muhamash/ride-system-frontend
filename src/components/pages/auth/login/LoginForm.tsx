/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMyToast } from "@/components/layouts/MyToast";
import { Button } from "@/components/ui/button";
import
    {
        Form,
        FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
    } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/api/auth.api";
import { loginSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValue, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import z from "zod";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form"> )
{
  const form = useForm<z.infer<typeof loginSchema>>( {
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  } );

  const [ loginUser, { isLoading, error } ] = useLoginMutation();
  const navigate = useNavigate();
  const { showToast } = useMyToast();

    const onSubmit: SubmitHandler<FieldValue> = async ( data: z.infer<typeof loginSchema> ) =>
    {
        // console.log( data );

        try
        {
            const result = await loginUser( data ).unwrap();
            // console.log( result, { isLoading, error } );
            

            showToast( {
                message: result?.message || "Welcome bro",
                type: "success",
            } );

            // console.log(result.data)
        
            navigate( "/" );
        }
        catch ( error )
        {
            showToast( {
                message: error?.data?.message,
                type: "error",
            } );

            if ( error?.data?.flag )
            {
                navigate( `/account-status-page/${error?.data?.userId}`, { state: error?.data?.flag } );
            }

            console.log( error?.data?.userId )
        }
    };


    return (
        <div className={cn(
            "flex flex-col gap-6",
            "bg-teal-100/20 backdrop-blur-md border border-gray-500 rounded-lg shadow-lg md:px-10 py-5 p-3",
            className
        )} >
            <Form {...form}>
                <form onSubmit={form.handleSubmit( onSubmit )} {...props}>
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <a
                                href="#"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                
                                <span className="sr-only">Free Ride Inc.</span>
                            </a>
                            <h1 className="text-xl text-center md:text-4xl font-bold text-accent">Welcome to Free Ride Inc.</h1>
                            <div className="text-center text-sm md:text-md text-yellow-500">
                                Wanted an account?{" "}
                                <Link className="underline underline-offset-4 text-red-700 font-bold bg-background px-3 py-2 rounded-md" to={"/registration"}>Register</Link>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input className="text-green-600" placeholder="Your email" {...field} type="email" />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is your public display email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input className="text-green-600" type="password" placeholder="Your password" {...field} />
                                        </FormControl>
                                        <FormDescription className="sr-only">
                                            This is your public display password.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full cursor-pointer">
                                {isLoading ? "working behind..." : "Login"}
                            </Button>
                        </div>

                        
                    </div>
                </form>
            </Form>
            <div className="text-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}