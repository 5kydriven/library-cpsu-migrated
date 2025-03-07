import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
setPersistence(auth, browserLocalPersistence)
	.then(() => {
		console.log('Auth persistence set to LOCAL');
	})
	.catch((error) => {
		console.error('Error setting persistence:', error);
	});

export { db, auth, storage, firebaseApp };
