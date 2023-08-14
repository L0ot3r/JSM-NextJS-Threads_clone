import  { SignIn } from '@clerk/nextjs';


export default function SignInPage() {
  return (
    <main className='flex w-full justify-center px-10 py-20'>
      <SignIn />
    </main>
  )
}