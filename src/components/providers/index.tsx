'use client';
import React from 'react';
import { Toaster } from 'react-hot-toast';

type Props = {
	children: React.ReactNode;
};

const Providers = ({ children }: Props) => {
	return (
		<>
			{children}
			<Toaster position="top-center" reverseOrder={false} />
		</>
	);
};

export default Providers;
