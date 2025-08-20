export type RegistrationValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    vehicleInfo?: { model: string; license: string; plateNumber: string };
};

export type LoginValues = {
    email: string;
    password: string;
}