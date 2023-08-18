'use server';

import { IProfileParams } from '@/types';
import { revalidatePath } from 'next/cache';

import { connectToDB } from '../mongoose';
import { SortOrder } from 'mongoose';
import { FilterQuery } from 'mongoose';

import User from '../models/user.model';
import Thread from '../models/thread.model';


export async function updateUser({
	userId,
	username,
	name,
	image,
	bio,
	path,
}: IProfileParams): Promise<void> {
	connectToDB();

	try {
		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				image,
				bio,
				onboarded: true,
			},
			{ upsert: true }
		);

		// revalidatePath() est une fonction de Next.js qui permet de mettre à jour le cache de la page en question (ici, le profil de l'utilisateur)
		if (path === '/profile/edit') {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(
			`Echec de la mise à jour de l'utilisateur: ${error.message}`
		);
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB();

		return await User.findOne({ id: userId });
		// .populate({
		// 	path: 'commuties',
		// 	model: 'Communty'
		// })
	} catch (error: any) {
		throw new Error(
			`Echec de la récupération de l'utilisateur: ${error.message}`
		);
	}
}

export async function fetchUserPosts(userId: string) {
	try {
		connectToDB();

		const threads = await User.findOne({ id: userId }).populate({
			path: 'threads',
			model: Thread,
			populate: {
				path: 'children',
				model: Thread,
				populate: {
					path: 'author',
					model: User,
					select: 'id name image',
				},
			},
		});

		return threads;
	} catch (error: any) {
		throw new Error(
			`Echec de la récupération des posts de l'utilisateur: ${error.message}`
		);
	}
}

export async function fetchAllUsers({
	userId,
	searchString = '',
	pageNumber = 1,
	pageSize = 20,
	sortBy = 'desc',
}: {
	userId: string;
	searchString?: string;
	pageNumber?: number;
	pageSize?: number;
	sortBy?: SortOrder;
}) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;
		const regex = new RegExp(searchString, 'i');

		// On crée une requête pour récupérer tous les utilisateurs sauf celui qui est connecté
		const query: FilterQuery<typeof User> = {
			id: { $ne: userId }, // $ne = not equal => tous les users sauf celui qui est connecté
		};

		// Si la recherche n'est pas vide, on ajoute une condition à la requête
		// $or = ou => on recherche dans le nom d'utilisateur ou le nom
		if (searchString.trim() !== '') {
			query.$or = [
				{ username: { $regex: regex } },
				{ name: { $regex: regex } },
			];
		}

		const sortOptions = { createdAt: sortBy };

		const usersQuery = User.find(query)
			.sort(sortOptions)
			.skip(skipAmount)
			.limit(pageSize);

		const totalUsersCount = await User.countDocuments(query);

		const users = await usersQuery.exec();

		const isNext = totalUsersCount > skipAmount + users.length;

		return { users, isNext };
	} catch (error: any) {
		throw new Error(
			`Echec de la récupération des utilisateurs: ${error.message}`
		);
	}
}

export async function getActivity(userId: string) {
	try {
		connectToDB()

		const userThreads = await Thread.find({ author: userId })

		// Récupération de tous les Threads IDs (réponses) depuis 'children'
		const childThreadIds = userThreads.reduce((acc, userThread) => {
			return acc.concat(userThread.children)
		}, [])

		const replies = await Thread.find({
			_id: { $in: childThreadIds },
			author: { $ne: userId },
		}).populate({
			path: 'author',
			model: User,
			select: '_id name image',
		})

		return replies;
		
	} catch (error: any) {
		throw new Error(`Failed to fetch activity: ${error.message}`)
	}
}
