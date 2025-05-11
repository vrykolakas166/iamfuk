'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForgotPassword() {
    const searchParams = useSearchParams();
    const success = searchParams.get('success');

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
            <h1 className="text-2xl font-semibold">Password Reset</h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
                {success 
                    ? "Check your email for a link to reset your password."
                    : "Something went wrong. Please try again."}
            </p>
            <Button asChild>
                <Link href="/access">Back to Sign In</Link>
            </Button>
        </div>
    );
} 