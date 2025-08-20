import { Ghost } from "lucide-react";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cyan-50 text-center p-4">
      <Ghost className="h-20 w-20 text-muted-foreground" />
      <h1 className="mt-6 text-3xl font-bold text-muted-foreground">Page Not Found</h1>
          <p className="mt-2 text-rose-800">Sorry, the page you are looking for does not exist.</p>
          <Link to={"/"} variant="outline" className="bg-chart-5 text-white px-5 py-2 rounded-md text-md shadow-2xl my-2">Back to home</Link>
    </div>
  );
}