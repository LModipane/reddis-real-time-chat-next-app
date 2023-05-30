'use client';
import Button from '@/components/ui/button';
import React, { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

function LoginPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	async function loginWithGoogle() {
		setIsLoading(true);
		try {
			await signIn('google');
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setIsLoading(false);
		}
	}
	return (
		<>
			<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col w-full max-w-md items-center space-y-8">
					<div className="flex flex-col gap-8 items-center">
						logo
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
							Sign In to your account
						</h2>
					</div>
					<Button
						isLoading={isLoading}
						type="button"
						className="max-w-sm w-full flex justify-center items-center gap-3 text-xl m-2"
						onClick={loginWithGoogle}>
						{isLoading ? null : (
							<Image
								src="/google.svg"
								alt="google-logo"
								width="20"
								height="20"
							/>
						)}
						Google
					</Button>
				</div>
			</div>
		</>
	);
}

export default LoginPage;
