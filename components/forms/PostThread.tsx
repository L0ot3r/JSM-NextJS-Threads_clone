'use client';

import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useOrganization } from '@clerk/nextjs';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Textarea,
	Button,
	FormMessage,
	Input,
} from '@/components/ui';

import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.actions';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';

function Preview({ img }: { img: string }) {
	return (
		<article className='w-full'>
			<Image
				src={img}
				alt='preview'
				width={500}
				height={500}
				className='w-full rounded-md object-cover'
			/>
		</article>
	);
}

function PostThread({ userId }: { userId: string }) {
	const pathname = usePathname();
	const router = useRouter();
	const { startUpload } = useUploadThing('media');
	const { organization } = useOrganization();
	const [files, setFiles] = useState<File[]>([]);

	const form = useForm({
		resolver: zodResolver(ThreadValidation),
		defaultValues: {
			thread: '',
			accountId: userId,
			imgThread: '' || undefined,
		},
	});

	// TODO: Modifier le formulaire pour qu'il puisse prendre en compte les images

	const handleImage = (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldChange: (value: string) => void
	) => {
		e.preventDefault();

		const fileReader = new FileReader();

		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];

			setFiles(Array.from(e.target.files));

			if (!file.type.includes('image')) return;

			fileReader.onload = async (event) => {
				const imageDataUrl = event.target?.result?.toString() || '';

				fieldChange(imageDataUrl);
			};

			fileReader.readAsDataURL(file);
		}
	};

	const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
		// For image upload
		const blob = values.imgThread;

		const hasImageAdded = blob ? isBase64Image(blob) : false;
		if (hasImageAdded) {
			const imgRes = await startUpload(files);

			if (imgRes && imgRes[0].fileUrl) {
				values.imgThread = imgRes[0].fileUrl;
			}
		}

		await createThread({
			text: values.thread,
			author: userId,
			imgThread: values.imgThread,
			communityId: organization ? organization.id : null,
			path: pathname,
		});

		router.push('/');
	};

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='mt-10 flex flex-col justify-start gap-10'
				>
					<FormField
						control={form.control}
						name='thread'
						render={({ field }) => (
							<FormItem className='flex flex-col gap-3 w-full'>
								<FormLabel className='text-base-semibold text-light-2'>
									Content
								</FormLabel>
								<FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
									<Textarea rows={15} placeholder="What's New" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='imgThread'
						render={({ field }) => (
							<>
								<FormControl className='flex-1 text-base-semibold text-gray-200'>
									<Input
										type='file'
										accept='image/*'
										placeholder='Upload a photo'
										className='account-form_image-input'
										onChange={(e) => handleImage(e, field.onChange)}
									/>
								</FormControl>
								<FormMessage />
							</>
						)}
					/>
					<Button type='submit' className='bg-primary-500'>
						Post Thread
					</Button>
				</form>
			</Form>
		</>
	);
}

export default PostThread;
