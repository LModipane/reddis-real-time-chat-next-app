import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function feedHrefConstructor(id1: string, id2: string) {
	const sortedArray = [id1, id2].sort();
	return `${sortedArray[0]}--${sortedArray[1]}`;
}
