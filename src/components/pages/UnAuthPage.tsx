import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnAuthPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-pink-100 py-30">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <LockIcon className="w-12 h-12 text-red-500 mb-3" />
          <CardTitle className="text-2xl font-bold text-red-500">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            You don’t have permission to view this page.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              className="px-6 py-2 rounded-xl"
            >
              Home
            </Button>
            {/* <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-xl"
            >
              Go Back
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
