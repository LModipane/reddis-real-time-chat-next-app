'use client';

import React, { ButtonHTMLAttributes, useState } from 'react';
import Button from '../ui/button';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignOutButton = ({ ...props }) => {
	const [isSigningOut, setisSigningOut] = useState(false);
	const logout = async () => {
		setisSigningOut(true);
		try {
			await signOut();
		} catch (error) {
			toast.error('Opps, failed to sign out');
		} finally {
			setisSigningOut(false);
		}
	};
	return (
		<Button
			isLoading={isSigningOut}
			{...props}
			varient="ghost"
			onClick={e => logout()}>
			{isSigningOut || <LogOut className="w-full h-full" />}
		</Button>
	);
};
