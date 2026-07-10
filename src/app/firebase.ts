import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';
import { getAuth } from 'firebase/auth';

const app = initializeApp(environment.firebase);

export const db = getFirestore(app);
export const auth = getAuth(app);
