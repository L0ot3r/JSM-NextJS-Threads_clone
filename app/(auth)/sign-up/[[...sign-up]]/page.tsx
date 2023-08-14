import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
	return (
		<main className='flex w-full justify-center px-10 py-20'>
			<SignUp />
		</main>
	);
}
