'use client';

import "@/public/css/access.css";
import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';
import { signInAction, signUpAction } from '@/app/actions';

interface FormEvent extends React.FormEvent<HTMLFormElement> {
    target: HTMLFormElement;
}

interface ValidationErrors {
    email?: string;
    password?: string;
    rePassword?: string;
}

export default function Access() {
    const ERRORS = {
        EMAIL_EMPTY: "Email cannot be empty.",
        EMAIL_FORMAT: "Email is not valid.",
        PASSWORD_EMPTY: "Password cannot be empty.",
        PASSWORD_LENGTH: "Password must be at least 8 characters long.",
        PASSWORD_UPPERCASE: "Password must contain at least one uppercase letter.",
        PASSWORD_LOWERCASE: "Password must contain at least one lowercase letter.",
        PASSWORD_NUMBER: "Password must contain at least one number.",
        PASSWORD_SPECIAL: "Password must contain at least one special character.",
        REPASSWORD_EMPTY: "Re-Password cannot be empty.",
        REPASSWORD_NOT_MATCH: "Passwords do not match.",
        SERVICES_NOT_AVAILABLE: "This feature is not available yet. Sorry for the inconvenience.",
        IN_DEVELOPMENT: "In development...",
    };

    const router = useRouter();

    const [slided, setSlided] = useState(false);
    const [mobileToggleVisibility, setMobileToggleVisibility] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    useEffect(() => {
        if (!email) return;
        const emailError = validateEmail(email);
        setErrors(prev => ({ ...prev, email: emailError }));
    }, [email]);

    useEffect(() => {
        if (!password) return;
        const passwordError = validatePassword(password);
        setErrors(prev => ({ ...prev, password: passwordError }));
        
        if (!passwordError && rePassword) {
            const rePasswordError = validateRePassword(password, rePassword);
            setErrors(prev => ({ ...prev, rePassword: rePasswordError }));
        }
    }, [password, rePassword]);

    const validateEmail = (email: string): string | undefined => {
        if (!email) return ERRORS.EMAIL_EMPTY;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ERRORS.EMAIL_FORMAT;
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return ERRORS.PASSWORD_EMPTY;
        return undefined;
    };

    const validateRePassword = (password: string, rePassword: string): string | undefined => {
        if (!rePassword) return ERRORS.REPASSWORD_EMPTY;
        if (password !== rePassword) return ERRORS.REPASSWORD_NOT_MATCH;
        return undefined;
    };

    const toggleOverlay = () => {
        setSlided(!slided);
        setErrors({});
    };

    const toggleOverlayInMobile = () => {
        setMobileToggleVisibility(!mobileToggleVisibility);
        toggleOverlay();
    };

    const signInByProvider = (provider: string) => {
        toast.info(ERRORS.SERVICES_NOT_AVAILABLE);
    };

    const isValidSignIn = () => !errors.email && !errors.password;
    const isValidSignUp = () => !errors.email && !errors.password && !errors.rePassword;

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        toast.info(ERRORS.SERVICES_NOT_AVAILABLE);
        return;
        e.preventDefault();
        if (!isValidSignUp()) {
            toast.error("Please fix the validation errors before signing up.");
            return;
        }
        if (!email || !password || !rePassword) {
            toast.error("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            await signUpAction(formData);
            toast.success('Sign up successfully.');
            router.push('/');
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT') {
                toast.success('Sign up successfully.');
                router.push('/');
            } else {
                toast.error(error.message || 'An error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault();
        if (!isValidSignIn()) {
            toast.error("Please fix the validation errors before signing in.");
            return;
        }
        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            await signInAction(formData);
            toast.success('Signed in successfully');
            router.push('/');
        } catch (error: any) {
            if (error.message === 'NEXT_REDIRECT') {
                toast.success('Signed in successfully');
                router.push('/');
            } else {
                toast.error(error.message || 'Failed to sign in');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-[400px]:h-[80vh] w-full">
            <div className="max-[400px]:w-full flex flex-row max-[768px]:flex-col min-[768px]:justify-center relative overflow-hidden rounded-lg min-[400px]:bg-gray-50 min-[400px]:dark:bg-gray-800 min-[400px]:shadow-md">
                <div id="SignUpForm" className={clsx(slided ? 'toRight' : 'toLeft', mobileToggleVisibility && 'max-[768px]:hidden')}>
                    <form onSubmit={handleSignUp} className="min-[400px]:w-[400px] w-full flex flex-col items-center justify-center my-4">
                        <h1 className="font-semibold my-2">Create Account</h1>
                        <div className="flex gap-4">
                            {["logos:microsoft-icon", "devicon:google", "logos:facebook", "skill-icons:discord"].map((name) => (
                                <Icon key={name} className="provider-log" icon={name} width={30} onClick={() => signInByProvider('discord')} />
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <hr className="w-20" /> <span>or</span> <hr className="w-20" />
                        </div>
                        <div className="flex flex-col gap-2 w-[70%]">
                            <Input
                                id="email1"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className={clsx(
                                    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400",
                                    errors.email ? "border-red-500" : ""
                                )}
                            />
                            {errors.email && <span className="text-[12px] text-red-500">{errors.email}</span>}
                            <div className="relative">
                                <Input
                                    id="password1"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className={clsx(
                                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
                                        errors.password ? "border-red-500" : ""
                                    )}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width={20} />
                                </button>
                            </div>
                            {errors.password && <span className="text-[12px] text-red-500">{errors.password}</span>}
                            <div className="relative">
                                <Input
                                    id="repassword1"
                                    type={showRePassword ? "text" : "password"}
                                    value={rePassword}
                                    onChange={(e) => setRePassword(e.target.value)}
                                    placeholder="Re-Password"
                                    className={clsx(
                                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
                                        errors.rePassword ? "border-red-500" : ""
                                    )}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => setShowRePassword(!showRePassword)}
                                >
                                    <Icon icon={showRePassword ? "mdi:eye-off" : "mdi:eye"} width={20} />
                                </button>
                            </div>
                            {errors.rePassword && <span className="text-[12px] text-red-500">{errors.rePassword}</span>}
                        </div>
                        <Button type="submit" className="w-[100px] mt-2" disabled={!isValidSignUp()}>
                            {!loading ? 'Sign Up' : <Icon icon="eos-icons:three-dots-loading" width={30} />}
                        </Button>
                        <span className="min-[769px]:hidden text-xs mt-3">
                            Already had an account ?{' '}
                            <a href="#" className="hover:underline text-blue-400" onClick={toggleOverlayInMobile}>Sign in</a>
                        </span>
                    </form>
                </div>

                <div id="SignInForm" className={clsx(slided ? 'toRight' : 'toLeft', !mobileToggleVisibility && 'max-[768px]:hidden')}>
                    <form onSubmit={handleSignIn} className="min-[400px]:w-[400px] w-full flex flex-col items-center justify-center my-4">
                        <h1 className="font-semibold my-2">Sign in</h1>
                        <div className="flex gap-4">
                            {["logos:microsoft-icon", "devicon:google", "logos:facebook", "skill-icons:discord"].map((name) => (
                                <Icon key={name} className="provider-log" icon={name} width={30} onClick={() => signInByProvider('discord')} />
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <hr className="w-20" /> <span>or</span> <hr className="w-20" />
                        </div>
                        <div className="flex flex-col gap-2 w-[70%]">
                            <Input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={clsx(
                                    "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400",
                                    errors.email ? "border-red-500" : ""
                                )}
                            />
                            {errors.email && <span className="text-[12px] text-red-500">{errors.email}</span>}
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className={clsx(
                                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-500 dark:focus-visible:border-blue-400 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
                                        errors.password ? "border-red-500" : ""
                                    )}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width={20} />
                                </button>
                            </div>
                            {errors.password && <span className="text-[12px] text-red-500">{errors.password}</span>}
                            <a href="#" className="hover:underline italic text-xs my-2" onClick={() => toast.info(ERRORS.SERVICES_NOT_AVAILABLE)}>
                                Forgot your password?
                            </a>
                        </div>
                        <Button type="submit" className="w-[100px]" disabled={!isValidSignIn()}>
                            {!loading ? 'Sign In' : <Icon icon="eos-icons:three-dots-loading" width={30} />}
                        </Button>
                        <span className="min-[769px]:hidden text-xs mt-3">
                            Haven't had an account ?{' '}
                            <a href="#" className="hover:underline text-blue-400" onClick={toggleOverlayInMobile}>Sign up</a>
                        </span>
                    </form>
                </div>

                <div id="overlay" style={{ zIndex: 3 }} className={clsx('w-[50%] h-full max-[768px]:hidden max-[768px]:h-[50%] max-[768px]:w-full absolute bg-gray-400 dark:bg-gray-500', slided && 'slide-panel')}>
                    <div className="flex flex-col items-center justify-center h-full">
                        {slided ? (
                            <div className="flex flex-col items-center gap-2 max-[768px]:mt-[-10vh]">
                                <h1>Welcome back!</h1>
                                <Button onClick={toggleOverlay} className="w-[100px]" id="signIn">Sign In</Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <h1>Welcome pal</h1>
                                <p>Haven't had an account ?</p>
                                <Button onClick={toggleOverlay} className="w-[100px]" id="signUp">Sign Up</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}