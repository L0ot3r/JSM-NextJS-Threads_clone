import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';

import { format } from 'date-fns';


const Page = async () => {

  const user = await currentUser();
  if(!user) return null

  const userInfo = await fetchUser(user.id);
  if(!userInfo.onboarded) redirect('/onboarding');

  const activity = await getActivity(userInfo._id);

  console.log(activity);
  

  return (
    <section>
      <h1 className="head-text text-light-1">Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => [
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className='activity-card'>
                  <Image 
                    src={activity.author.image}
                    alt='user image'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activity.author.name} {" "}
                    </span>
                    a répondu à votre thread
                  </p>
                  <div className='flex flex-1 justify-end'>
                    <p className='text-light-2 text-small-regular'>
                      {format(new Date(activity.createdAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </article>
              </Link>
            ])}
          </>
        ) : (
          <p className='no-result'>Il n'y a rien pour le moment ici !</p>
        )}
      </section>
    </section>
  )
}

export default Page