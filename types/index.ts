export interface IProfile {
  user?: {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
  },
  btnTitle: string
}

export interface IProfileParams {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string
}

export interface IThreadParams {
  text: string,
  author: string,
  imgThread?: string,
  communityId: string | null,
  path: string
}

export interface IThreadProps {
  id: string,
	currentUserId: string,
	parentId: string | null,
	author: {
    name: string,
    image: string,
    id: string,
  },
  imgThread: string,
	content: string,
	community: {
    name: string,
    id: string,
    image: string,
  } | null,
	createdAt: string,
	comments: {
    author: {
      image: string,
    }
  }[],
  isComment?: boolean,
}

export interface ICommentProps {
  threadId: string, 
  currentUserId: string, 
  currentUserImg: string,
}

export interface IProfileHeaderProps {
  accountId: string,
  authUserId: string,
  name: string,
  username: string,
  imgUrl: string,
  bio: string,
  type?: 'User' | 'Community',
}

export interface IThreadsTabProps {
  currentUserId: string, 
  accountId: string, 
  accountType: string,
}

export interface IUserCardProps {
  id: string,
  name: string,
  username: string,
  imgUrl: string,
  personType: string,
}