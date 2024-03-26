

import { initializeApp } from "firebase/app";
import { collection, getDocs, addDoc, doc, updateDoc, getFirestore, query, where, arrayUnion, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";


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
const auth = getAuth(app);

async function getCollection(collectionName, param) {
    const querySnapshot = await getDocs(query(collection(db, collectionName), where("from", "==", param)));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
    });
    return data;
}

async function setDocument(collectionName, data, param) {
    data.last_update_on = new Date().getDate().toString() + "/" + new Date().getMonth().toString() + "/" + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
    data.from = param; 

    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id; // Return the document ID
}

// Update a specific document
async function updateDocument(collectionName, documentId, data) {
    // Add the current time to the data
    data.last_update_on = new Date().getDate().toString() + "/" + new Date().getMonth().toString() + "/" + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString();

    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
}


// Sign Up function
async function signUp(email, password, username) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create a new document in the 'users' collection
        await setDocument("users", { email, username }); // Assuming 'username' holds the username
        return userCredential.user;

    } catch (error) {
        throw error;
    }

}

// Sign In function
async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Sign Out function
async function signOutUser() {
    await signOut(auth);
}


const getForms = async (user) => await getCollection('forms', user);
const setForm = async (data, user) => await setDocument('forms', data, user);
async function getForm(formId) {
    try {
        const formDoc = await getDoc(doc(db, 'forms', formId));
        if (formDoc.exists()) {
            return { id: formDoc.id, ...formDoc.data() };
        } else {
            throw new Error("Form not found");
        }
    } catch (error) {
        console.error("Get Form Error:", error);
        throw error;
    }
}



const getQuestions = async (formId) => await getCollection('questions', formId);
async function setQuestion(data, formId) {
    try {
        const questionDocRef = await setDocument('questions', data, formId);

        const formDocRef = doc(db, 'forms', formId);
        await updateDoc(formDocRef, {
            questions: arrayUnion(questionDocRef) 
        });

        return questionDocRef.id;
    } catch (error) {
        console.error("Set Question Error:", error);
        throw error; 
    }
}
const updateQuestion = async (id, data) => await updateDocument('questions', id, data);
const updateForm = async (id, data) => await updateDocument('forms', id, data);
const getResponses = async (formId) => await getCollection('responses', formId);
const setResponse = async (data, formId) => await setDocument('responses', data, formId);
const updateResponse = async (id, data) => await updateDocument('responses', id, data);

export { signUp, signIn, signOutUser, getForms, setForm, getForm, updateForm, getQuestions, setQuestion, updateQuestion, getResponses, setResponse, updateResponse };

