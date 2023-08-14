import { fetchUserPosts } from '@/lib/actions/user.actions';
import { IThreadProps, IThreadsTabProps } from '@/types';
import { redirect } from 'next/navigation';
import { ThreadCard } from '../cards';

const ThreadsTab = async ({
	currentUserId,
	accountId,
	accountType,
}: IThreadsTabProps) => {
	let result = await fetchUserPosts(accountId);

	if (!result) redirect('/');

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{result.threads.map((thread: any) => (
				<ThreadCard
					key={thread._id}
					id={thread._id}
					currentUserId={currentUserId}
					parentId={thread.parentId}
					author={
						accountType === 'User'
							? { name: result.name, image: result.image, id: result.id }
							: {
									name: thread.author.name,
									image: thread.author.image,
									id: thread.author.id,
							  }
					} // todo
					content={thread.text}
					community={thread.community} // todo
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			))}
		</section>
	);
};

export default ThreadsTab;
