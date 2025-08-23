import RegistrationForm from "./RegistrationForm";

export default function RegistrationPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="bg-muted relative hidden lg:block">
                <img
                    src="/registration.webp"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                
                <div className="flex flex-col gap-5 justify-center items-center min-h-screen">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-xl text-center md:text-4xl font-bold text-chart-5">Please register to Free Ride Inc.</h1>
                        
                    </div>
                    <div className="w-full max-w-xs">
                        <RegistrationForm />
                    </div>
                </div>
            </div>
        </div>
    );
}