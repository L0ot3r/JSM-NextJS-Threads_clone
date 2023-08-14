'use server';

import { IThreadParams } from '@/types';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { revalidatePath } from 'next/cache';

export async function createThread({
	text,
	author,
	communityId,
	path,
}: IThreadParams) {
	connectToDB();

	const createdThread = await Thread.create({
		text,
		author,
		community: null,
	});

	// Update user model
	await User.findByIdAndUpdate(author, {
		$push: { threads: createdThread._id },
	});

	revalidatePath(path);
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
	connectToDB();

	// Calculer le nombre de post à sauter
	const skipAmount = pageSize * (pageNumber - 1);

	// Récupérer les posts qui n'ont pas de parent
	const postsQuery = Thread.find({
		parentId: { $in: [null, undefined] },
	})
		.sort({ createdAt: 'desc' })
		.skip(skipAmount)
		.limit(pageSize)
		.populate({ path: 'author', model: User })
		.populate({
			path: 'children',
			populate: {
				path: 'author',
				model: User,
				select: '_id name parentId image',
			},
		});

	// Récupérer le nombre total de posts
	const totalPostsCount = await Thread.countDocuments({
		parentId: { $in: [null, undefined] },
	});

	const posts = await postsQuery.exec();

	const isNext = totalPostsCount > skipAmount + posts.length;

	return { posts, isNext };
}

export async function fetchThreadById(id: string) {
	connectToDB();

	try {
		// A faire: populate community
		const thread = await Thread.findById(id)
			.populate({ path: 'author', model: User, select: '_id name id image' })
			.populate({
				path: 'children',
				populate: [
					{
						path: 'author',
						model: User,
						select: '_id id name parentId image',
					},
					{
						path: 'children',
						model: Thread,
						populate: {
							path: 'author',
							model: User,
							select: '_id id name parentId image',
						},
					},
				],
			})
			.exec();

		return thread;
	} catch (error: any) {
		throw new Error(`Error fetching Thread ${id}: ${error.message}`);
	}
}

export async function addCommentToThread(
	threadId: string,
	commentText: string,
	userId: string,
	path: string
) {
	connectToDB();

	try {
		// Trouver le thread original
		const originalThread = await Thread.findById(threadId);

		// Créer le commentaire pour ce thread avec le bon parent
		const commentThread = new Thread({
			text: commentText,
			author: userId,
			parentId: threadId,
		})

		// Sauvegarder le commentaire dans la base de données
		const savedCommentThread = await commentThread.save();

		// Ajouter le commentaire au thread original
		originalThread.children.push(savedCommentThread._id);

		// Sauvegarder le thread original
		await originalThread.save();

		revalidatePath(path);

	} catch (error: any) {
		throw new Error(
			`Error adding comment to thread ${threadId}: ${error.message}`
		);
	}
}
