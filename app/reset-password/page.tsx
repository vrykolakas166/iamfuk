'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';
import { resetPasswordAction } from '@/app/actions';
import { createClient } from '@/utils/supabase/client';

export default function ResetPassword() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error || !session) {
                toast.error('Reset link has expired. Please request a new one.');
                router.push('/access');
                return;
            }

            setIsValid(true);
        };

        checkSession();
    }, [router]);

    if (!isValid || !email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
                <h1 className="text-2xl font-semibold">Invalid Reset Link</h1>
                <p className="text-center text-gray-600 dark:text-gray-400">
                    This password reset link has expired. Please request a new one.
                </p>
                <Button asChild>
                    <a href="/access">Back to Sign In</a>
                </Button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !rePassword) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password !== rePassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('password', password);
            formData.append('rePassword', rePassword);
            formData.append('email', email);
            await resetPasswordAction(formData);
            toast.success('Password reset successfully');
            router.push('/access');
        } catch (error: any) {
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
            <h1 className="text-2xl font-semibold">Reset Password</h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
                Reset password for {email}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width={20} />
                    </button>
                </div>
                <div className="relative">
                    <Input
                        type={showRePassword ? "text" : "password"}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        onClick={() => setShowRePassword(!showRePassword)}
                    >
                        <Icon icon={showRePassword ? "mdi:eye-off" : "mdi:eye"} width={20} />
                    </button>
                </div>
                <Button type="submit" disabled={loading || !password || !rePassword}>
                    {loading ? (
                        <Icon icon="eos-icons:three-dots-loading" width={30} />
                    ) : (
                        'Reset Password'
                    )}
                </Button>
            </form>
        </div>
    );
} 