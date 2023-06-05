import { UserPlus, LucideProps } from 'lucide-react';
import Image from 'next/image';

export const Icons = {
	Logo: (props: LucideProps) => (
		<Image src="/logo.jpg" width={150} height={150} alt="logo" />
	),
	UserPlus,
};

export type Icon = keyof typeof Icons;
