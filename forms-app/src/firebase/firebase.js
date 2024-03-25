

import { initializeApp } from "firebase/app";
import { collection, getDocs, addDoc, doc, updateDoc, getFirestore } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";


const firebaseConfig = {
    apiKey: "AIzaSyBysw2tJeqJFkbZ-B0K6VF4gonEHufryyE",
    authDomain: "forms-app-ee9a6.firebaseapp.com",
    projectId: "forms-app-ee9a6",
    storageBucket: "forms-app-ee9a6.appspot.com",
    messagingSenderId: "631578205904",
    appId: "1:631578205904:web:cf2e7b9c08faf5b457c8d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication


async function getCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    return data;
}

// Set a new document in a collection
async function setDocument(collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id; // Return the document ID
}

// Update a specific document
async function updateDocument(collectionName, documentId, data) {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
}


// Sign Up function
async function signUp(email, password, username) {
    let uid;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // uid = userCredential.user.uid; // Get the user ID
        // // Create a new document in the 'users' collection
        // const userRef = doc(db, "users", uid);
        // await setDocument(userRef, { email, username }); // Assuming 'username' holds the username
        toast.success("Conta criada com sucesso")
        console.log("Conta criada com sucesso")
        return userCredential.user;

    } catch (error) {
        error.code === "auth/email-already-in-use" ? toast.error("Email já em uso") : toast.error("Email ou senha inválidos")
        console.error("Sign Up Error:", error.code);
    }

}

// Sign In function
async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success("Loggado com sucesso")
        return userCredential.user;
    } catch (error) {
        toast.error("Email ou senha inválidos")
        console.error("Sign In Error:", error.message);
        // Handle errors appropriately (e.g., display error message to user)
    }
}

// Sign Out function
async function signOutUser() {
    await signOut(auth);
}


// Example usage (assuming collections named 'forms' and 'questions')
const getForms = async () => await getCollection('forms');
const setForm = async (data) => await setDocument('forms', data);
const updateForm = async (id, data) => await updateDocument('forms', id, data);

const getQuestions = async () => await getCollection('questions');
const setQuestion = async (data) => await setDocument('questions', data);
const updateQuestion = async (id, data) => await updateDocument('questions', id, data);

export { signUp, signIn, signOutUser, getForms, setForm, updateForm, getQuestions, setQuestion, updateQuestion };

