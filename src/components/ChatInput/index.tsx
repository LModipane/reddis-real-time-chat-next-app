'use client';
import React, { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import toast from 'react-hot-toast';
import Button from '../ui/button';
type Props = {
	chatPartner: User;
	feedId: string;
};

export default function ChatInput({ chatPartner, feedId }: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [userInput, setUserInput] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const sendMessage = async () => {
		if (!userInput) return;
		setIsLoading(true);

		try {
			await axios.post('/api/message/send', { text: userInput, feedId });
			setUserInput('');
			textareaRef.current?.focus();
		} catch {
			toast.error('Something went wrong. Please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
			<div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
				<TextareaAutosize
					ref={textareaRef}
					onKeyDown={e => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					rows={1}
					maxRows={4}
					value={userInput}
					onChange={e => setUserInput(e.target.value)}
					placeholder={`Message ${chatPartner.name}`}
					className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
				/>

				<div
					onClick={() => textareaRef.current?.focus()}
					className="py-2"
					aria-hidden="true">
					<div className="py-px">
						<div className="h-9"/>
					</div>
				</div>

				<div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
					<div className="flex-shrin-0">
						<Button isLoading={isLoading} onClick={sendMessage} type="submit">
							Post
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
