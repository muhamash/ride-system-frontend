/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetUserByIdQuery } from "@/redux/features/api/admin.api";
import { AlertCircle, AlertTriangle, CheckCircle, Loader2, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { useMyToast } from "../layouts/MyToast";

const AccountStatusPage = () => {
  
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [ submitStatus, setSubmitStatus ] = useState<"idle" | "success" | "error">( "idle" );
    
    const location = useLocation();
    const params = useParams();

    console.log( location?.state,params );

    const [ accountStatus, setAccountStatus ] = useState<"SUSPENDED" | "BLOCKED">( location?.state );
    
    const { data, isLoading } = useGetUserByIdQuery( params?.id );
    // console.log(data)
    const { showToast } = useMyToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
      setSubmitStatus( "idle" );
      
      
    
    // Simulate request 
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
          setSubmitStatus( "success" );
          showToast( {
              type: "success",
              message:" this is a fake api request"
          })
        setMessage("");
      } else {
        throw new Error("Submission failed");
      }
    } catch ( error )
    {
         showToast( {
              type: "error",
              message:" this is a fake api request"
          })
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

    
    if( isLoading ){
        return <p>Loading...</p>
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
                  <h1 className="text-3xl font-bold text-slate-800">Account Management Portal for : { data?.data?.name }</h1>
                  <p className="text-slate-600 mt-2">hey { data?.data?.name }, Review your account status and resolve any issues</p>
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <div className={`p-3 rounded-full ${
                accountStatus === "SUSPENDED" 
                  ? "bg-amber-100 text-amber-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                {accountStatus === "SUSPENDED" ? (
                  <AlertTriangle className="h-8 w-8" />
                ) : (
                  <AlertCircle className="h-8 w-8" />
                )}
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              Account {accountStatus === "SUSPENDED" ? "SUSPENDED" : "BLOCKED"}
            </CardTitle>
            <CardDescription className="text-center max-w-md mx-auto">
              {accountStatus === "SUSPENDED" 
                ? "Your account has been temporarily SUSPENDED due to policy violations."
                : "Your account has been BLOCKED for security reasons."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                accountStatus === "SUSPENDED" 
                  ? "bg-amber-100 text-amber-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {accountStatus === "SUSPENDED" ? "SUSPENDED" : "BLOCKED"}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Required Actions</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
                  {accountStatus === "SUSPENDED" ? (
                    <>
                      <li>Review our community guidelines</li>
                      <li>Verify your account information</li>
                      <li>Submit an appeal if you believe this was a mistake</li>
                    </>
                  ) : (
                    <>
                      <li>Secure your account with a new password</li>
                      <li>Verify your identity with our support team</li>
                      <li>Complete additional security verification</li>
                    </>
                  )}
                </ul>
                
                <div className="pt-4">
                  <h3 className="font-semibold text-slate-800 mb-3">Contact Support</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600">
                      <Mail className="mr-2 h-4 w-4" />
                      support@company.com
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone className="mr-2 h-4 w-4" />
                      +1 (555) 123-4567
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Our support team is available Monday-Friday from 9AM-5PM EST.
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Submit an Appeal</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-slate-700">
                      Message to Administrator
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please explain your situation and why you believe your account should be reinstated..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Appeal"
                    )}
                  </Button>
                </form>
                
                {submitStatus === "success" && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Success</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your appeal has been submitted successfully. We'll contact you within 24-48 hours.
                    </AlertDescription>
                  </Alert>
                )}
                
                {submitStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      There was a problem submitting your appeal. Please try again or contact support directly.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="text-xs text-slate-500 text-center">
                <p>Reference ID: ACCT-2023-{accountStatus === "SUSPENDED" ? "SUSPENDED" : "BLOCKED"}-78942</p>
                <p className="mt-1">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Link className="bg-cyan-800 text-white px-5 py-2 rounded-md font-mono" to={"/"}>BACK TO HOME</Link>
        </div>
      </div>
    </div>
  );
};

export default AccountStatusPage;