'use client';

import * as z from 'zod';
import { ICommentProps } from '@/types';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { usePathname, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Button,
	Input,
} from '@/components/ui';
import { CommentValidation } from '@/lib/validations/thread';
import { addCommentToThread } from '@/lib/actions/thread.actions';

const Comment = ({
	threadId,
	currentUserId,
	currentUserImg,
}: ICommentProps) => {
	const pathname = usePathname();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addCommentToThread(
			threadId,
			values.thread,
			JSON.parse(currentUserId),
			pathname
		);

		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='comment-form'>
				<FormField
					control={form.control}
					name='thread'
					render={({ field }) => (
						<FormItem className='flex items-center gap-3 w-full'>
							<FormLabel>
								<Image
									src={currentUserImg}
									alt='user image'
									width={50}
									height={50}
									className='rounded-full object-contain'
								/>
							</FormLabel>
							<FormControl className='border-none bg-transparent'>
								<Input
									type='text'
									placeholder='Comment ...'
									{...field}
									className='no-focus text-light-1 outline-none'
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button type='submit' className='comment-form_btn'>
					Reply
				</Button>
			</form>
		</Form>
	);
};

export default Comment;
