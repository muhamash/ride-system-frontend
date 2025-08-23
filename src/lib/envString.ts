export const envString: Record<string, string> = {
    baseUrl: import.meta.env.VITE_BASE_URL as string,
    locationIQToken: import.meta.env.LOCATIONIQTOKEN as string
}