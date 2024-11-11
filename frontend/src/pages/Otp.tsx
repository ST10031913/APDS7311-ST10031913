import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { LockOpen } from 'lucide-react';

// Props Used to send message to be displayed in Notification Panel
interface OtpProps {
    onLogin: (message: string, time: string) => void;
}

const Otp: React.FC<OtpProps> = ({ onLogin }) => {
    // variables to hold states for values
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Function used to login the User using the OTP from email
    const handleOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setMessage('Complete OTP');
            setIsError(true);
            return;
        }

        const sessionToken = sessionStorage.getItem('sessionToken');
        
        setIsLoading(true);

        const response = await fetch(`${import.meta.env.VITE_EXPRESS_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ otp, sessionToken }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage('Redirecting to Dashboard');
            setIsError(false);
            setTimeout(() => {
                window.location.replace('/dashboard');
                onLogin('Successful Login Using OTP', Date().toLocaleString());
                setIsLoading(false);
            }, 5000);
        } else {
            setMessage(data.message);
            setIsError(true);
        }
    };

    // Use Effect to Set Messages
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            {message && (
                <Alert
                    variant="default"
                    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md"
                >
                    {isError ? (
                        <ExclamationTriangleIcon className="h-8 w-8 mr-2 " />
                    ) : (
                        <RocketIcon className="h-8 w-8 mr-2 text-green-400" />
                    )}
                    <AlertTitle className={`text-lg ${isError ? "text-red-600" : "text-green-500"}`}>
                        {isError ? "Error Occurred!" : "Heads-Up!"}
                    </AlertTitle>
                    <AlertDescription className={`text-lg ${isError ? "text-red-600" : "text-black"}`}>{message}</AlertDescription>
                </Alert>
            )}
            {isLoading ? (
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[200px] w-[400px] rounded-xl" style={{ backgroundColor: '#cde74c' }} />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[400px]" style={{ backgroundColor: '#cde74c' }} />
                        <Skeleton className="h-4 w-[400px]" style={{ backgroundColor: '#cde74c' }} />
                    </div>
                </div>
            ) : (
                <Card className="w-[350px] -mt-40">
                    <CardHeader>
                        <CardTitle>OTP</CardTitle>
                        <CardDescription>Use OTP sent to email</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleOtp}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5 relative">
                                    <Label htmlFor="otp">OTP</Label>
                                    <div className='relative'>
                                        <LockOpen className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="OTP"
                                            value={otp}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value) && value.length <= 6) {
                                                    setOtp(value);
                                                }
                                            }}
                                            required
                                            className="pl-10 pr-10"
                                        />
                                    </div>
                                </div>
                            </div>
                            <CardFooter className="flex justify-center mt-4">
                                <Button className='bg-green-600 hover:bg-green-950 w-full' type="submit">Submit</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default Otp;
