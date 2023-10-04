'use client'

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { deleteThread } from '@/lib/actions/thread.actions';

const DeleteBtn = ({ threadID } : { threadID : string }) => {
  const path = usePathname();
	return (
		<button
			className='flex items-center justify-center w-8 h-8 rounded-full bg-dark-4'
			onClick={() => {
        // console.log(threadID, path);
        deleteThread(threadID, path);
      }}
		>
			<Image
				src='/assets/delete.svg'
				alt='delete'
				width={20}
				height={20}
				className='cursor-pointer object-contain'
			/>
		</button>
	);
};

export default DeleteBtn;
