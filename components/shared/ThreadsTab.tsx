import { IThreadsTabProps } from '@/types';
import { redirect } from 'next/navigation';

import { ThreadCard } from '../cards';

import { fetchUserPosts } from '@/lib/actions/user.actions';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

const ThreadsTab = async ({
	currentUserId,
	accountId,
	accountType,
}: IThreadsTabProps) => {
	let result: any;

	if (accountType === 'User') {
		result = await fetchUserPosts(accountId);
	} else if (accountType === 'Community') {
		result = await fetchCommunityPosts(accountId);
	}

	if (!result) redirect('/');

	return (
		<section className='mt-9 flex flex-col gap-10'>
			{result.threads.map((thread: any) => (
				<ThreadCard
					key={thread._id}
					id={thread._id}
					currentUserId={currentUserId}
					parentId={thread.parentId}
					imgThread={thread.imgThread}
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
