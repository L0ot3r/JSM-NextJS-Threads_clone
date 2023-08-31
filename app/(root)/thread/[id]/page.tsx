import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs';

import { ThreadCard } from '@/components/cards';
import { Comment } from '@/components/forms';

import { fetchThreadById } from '@/lib/actions/thread.actions';
import { fetchUser } from '@/lib/actions/user.actions';

const Page = async ({ params }: { params: { id: string } }) => {
	if (!params.id) return null;

	const user = await currentUser();
	if (!user) return null;

	const userInfo = await fetchUser(user.id);
	if (!userInfo?.onboarded) redirect('/onboarding');

	const thread = await fetchThreadById(params.id);

	return (
		<section>
			<div>
				<ThreadCard
					key={thread._id}
					id={thread._id}
					currentUserId={user?.id || ''}
					parentId={thread.parentId}
					author={thread.author}
					content={thread.text}
					community={thread.community}
					createdAt={thread.createdAt}
					comments={thread.children}
				/>
			</div>

			<div className='mt-7'>
				<Comment
					threadId={JSON.stringify(thread._id)}
					currentUserImg={userInfo.image}
					currentUserId={JSON.stringify(userInfo._id)}
				/>
			</div>
			<div className='mt-10'>
				{thread.children.map((childrenItem: any) => (
					<ThreadCard
						key={childrenItem._id}
						id={childrenItem._id}
						currentUserId={user?.id}
						parentId={childrenItem.parentId}
						author={childrenItem.author}
						content={childrenItem.text}
						community={childrenItem.community}
						createdAt={childrenItem.createdAt}
						comments={childrenItem.children}
						isComment
					/>
				))}
			</div>
		</section>
	);
};

export default Page;
