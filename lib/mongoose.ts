import mongoose from 'mongoose';

let isConnected = false; // verifie si mongoose est connecté

export const connectToDB = async () => {
	mongoose.set('strictQuery', true);

  // si la variable d'environnement n'est pas définie, on ne se connecte pas
	if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
  // si on est déjà connecté, on ne se reconnecte pas
	if (isConnected) return console.log('Already connected to database');

	try {
    // on se connecte à la base de données
		await mongoose.connect(process.env.MONGODB_URL);

    // on indique que l'on est connecté
		isConnected = true;
		console.log('Connected to database');
	} catch (error) {
		console.log(error);
	}
};
