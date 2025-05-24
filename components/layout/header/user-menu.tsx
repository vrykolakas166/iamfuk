'use client';

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, User } from "lucide-react";

interface UserMenuProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function UserMenu({ isMobile = false, onClose }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (!isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  const handleItemClick = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const result = await signOutAction();
      // If we get here, it means signOutAction didn't redirect
      // This is an error case
      toast.error('Sign out failed');
    } catch (error: any) {
      if (error.message === 'NEXT_REDIRECT') {
        // This is a successful sign-out
        toast.success('Signed out successfully');
        onClose?.();
        router.push('/access');
      } else {
        // This is an actual error
        toast.error(error.message || 'Failed to sign out');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <Link
          className="block w-full py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
          href="/protected"
          onClick={handleItemClick}
        >
          Dashboard
        </Link>
        <form action={handleSignOut} className="w-full mt-2">
          <Button 
            type="submit" 
            variant="outline" 
            className="w-full hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign out'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User size={20} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link
              href="/protected"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <form action={handleSignOut}>
              <button
                type="submit"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                role="menuitem"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign out'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 