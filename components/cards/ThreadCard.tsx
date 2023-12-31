import { formatDateString } from '@/lib/utils';
import { IThreadProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';


import { DeleteBtn } from '../shared';	

const ThreadCard = ({
	id,
	currentUserId,
	parentId,
	author,
	content,
	community,
	createdAt,
	comments,
	isComment,
	imgThread,
}: IThreadProps) => {
	return (
		<article
			className={`flex w-full flex-col rounded-xl p-7 ${
				isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'
			}`}
		>
			<div className='flex items-start justify-between'>
				<div className='flex w-full flex-1 flex-row gap-4'>
					<div className='flex flex-col items-center'>
						<Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
							<Image
								src={author.image}
								alt={author.name}
								className='rounded-full object-cover'
								fill
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</Link>
						<div className='thread-card_bar' />
					</div>
					<div className='flex w-full flex-col'>
						<Link href={`/profile/${author.id}`} className='w-fit'>
							<h4 className='text-base-semibold text-light-1'>{author.name}</h4>
						</Link>
						<p className='mt-2 text-small-regular text-light-2'>{content}</p>
						{imgThread && (
							<Image
								src={imgThread}
								alt='thread img'
								width={500}
								height={500}
								className='mt-2 w-full rounded-xl object-cover'
							/>
						)}
						<div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
							<div className='flex items-center gap-3.5'>
								<Image
									src='/assets/heart-gray.svg'
									alt='heart'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/>
								<Link
									href={`/thread/${id}`}
									className='flex items-center gap-1'
								>
									<Image
										src='/assets/reply.svg'
										alt='reply'
										width={24}
										height={24}
										className='cursor-pointer object-contain'
									/>
								</Link>
								<Image
									src='/assets/repost.svg'
									alt='repost'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/>
								<Image
									src='/assets/share.svg'
									alt='share'
									width={24}
									height={24}
									className='cursor-pointer object-contain'
								/>
							</div>
						</div>
					</div>
				</div>
				{/* Delete Thread */}
				{currentUserId === author.id && <DeleteBtn  threadID={id} />}
				{/* Comment logo */}
			</div>
			{!isComment && community ? (
				<Link
					href={`/communities/${community.id}`}
					className='mt-5 flex items-center gap-1'
				>
					<p className='text-subtle-medium text-gray-1'>
						{formatDateString(createdAt)} - {community.name} Community
					</p>
					<Image
						src={community.image}
						alt={community.name}
						width={14}
						height={14}
						className='rounded-full object-cover'
					/>
				</Link>
			) : (
				<div className='mt-5 flex items-center gap-1'>
					<p className='text-subtle-medium text-gray-1'>
						{formatDateString(createdAt)}
					</p>
				</div>
			)}
			{!isComment && comments.length > 0 && (
				<div className='ml-1 mt-3 flex items-center gap-2'>
					{comments.slice(0, 2).map((comment, index) => (
						<Image
							key={index}
							src={comment.author.image}
							alt={`user_${index}`}
							width={20}
							height={20}
							className={`${index !== 0 && '-ml-5'} rounded-full object-cover`}
						/>
					))}

					<Link href={`/thread/${id}`}>
						<p className='mt-1 text-subtle-medium text-gray-1'>
							{comments.length} commentair{comments.length > 1 ? 'es' : 'e'}
						</p>
					</Link>
				</div>
			)}
		</article>
	);
};

export default ThreadCard;
