import { UserRole } from "@/constants/userRole";
import { z } from "zod";


const vehicleField = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val));

export const registrationSchema = z
    .object( {
        name: z.string().min( 2, "Name is required" ),
        email: z.string().email( "Invalid email" ),
        password: z.string().min( 6, "Password must be at least 6 characters" ),
        confirmPassword: z.string().min( 6, "Confirm password is required" ),
        role: z.nativeEnum( UserRole ),
        vehicleInfo: z
            .object( {
                model: vehicleField,
                license: vehicleField,
                plateNumber: vehicleField,
            } )
            .optional(),
    } )
    .refine( ( data ) => data.password === data.confirmPassword, {
        path: [ "confirmPassword" ],
        message: "Passwords do not match",
    } )
    .refine(
        ( data ) =>
        {
            if ( data.role === UserRole.DRIVER )
            {
                return (
                    data.vehicleInfo?.model &&
                    data.vehicleInfo?.license &&
                    data.vehicleInfo?.plateNumber
                );
            }
            return true;
        },
        {
            path: [ "vehicleInfo" ],
            message: "Vehicle information is required for drivers",
        }
    );
  
export const loginSchema = z.object( {
  email: z.email().min( 2 ).max( 50 ),
  password: z.string().min( 6 ).max( 50 ),
} );

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegistrationSchemaType = z.infer<typeof registrationSchema>;