'use client';
import React, { useState } from 'react';
import Button from '../ui/button';
import { addFriendValidator } from '@/lib/validators/add-friend';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type FormData = z.infer<typeof addFriendValidator>;

const AddChatButton = () => {
	const [friendEmail, setFriendEmail] = useState<string>('');
	const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

	const {
		register,
		setError,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(addFriendValidator),
	});

	const addFriend = async (friendEmail: string) => {
		try {
			const validatedEmail = addFriendValidator.parse({ email: friendEmail });
			await axios.post('/api/friends/add', { email: validatedEmail.email });
			setIsSuccessful(true);
		} catch (error) {
			if (error instanceof z.ZodError) {
				setError('email', { message: error.message });
				return;
			}
			if (error instanceof AxiosError) {
				setError('email', { message: error.response?.data });
				return;
			}

			setError('email', { message: 'Opps, Something went wrong' });
		}
	};

	const onSubmit = (data: FormData) => {
		addFriend(data.email);
	};

	return (
		<form className="max-w-sm" onSubmit={handleSubmit(onSubmit)}>
			<label
				htmlFor="email"
				className="block text-sm font-medium text-gray-700 leading-6">
				Add friend by email:
			</label>
			<div className="mt-2 flex gap-4">
				<input
					type="text"
					className="block w-full rounded-md border-0 text-gray-900 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
					placeholder="friend@example.com"
					{...register('email')}
				/>
				<Button isLoading={false} type="submit">
					Add
				</Button>
			</div>
			<p className="mt-1 text-red-600 text-sm">{errors.email?.message}</p>
			{isSuccessful && (
				<p className="mt-1 text-green-600 text-sm"> friend request sent</p>
			)}
		</form>
	);
};

export default AddChatButton;
