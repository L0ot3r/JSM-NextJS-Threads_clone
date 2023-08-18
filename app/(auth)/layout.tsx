import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const metadata: Metadata = {
	title: 'Threads',
	description: 'A simple forum using NextJS 13',
};

const inter = Inter({ subsets: ['latin'] });

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
			}}
		>
			<html lang='fr'>
				<body className={`${inter.className} bg-dark-1`}>
					<div className='w-full flex justify-center items-center min-h-screen'>
						{children}
					</div>
				</body>
			</html>
		</ClerkProvider>
	);
}
