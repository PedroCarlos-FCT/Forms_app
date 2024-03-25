

import { initializeApp } from "firebase/app";
import { collection, getDocs, addDoc, doc, updateDoc, getFirestore, query, where, arrayUnion, getDoc } from "firebase/firestore";
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

async function getCollection(collectionName, param) {
    const querySnapshot = await getDocs(query(collection(db, collectionName), where("from", "==", param)));
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() }); // Include document ID along with its data
    });
    return data;
}

// Set a new document in a collection
async function setDocument(collectionName, data, param) {
    // Add the current time to the data
    data.last_update_on = new Date().getDate().toString() + "/" + new Date().getMonth().toString() + "/" + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
    // Set the user who created the form
    data.from = param; // Assuming user object has a unique identifier (uid)

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
const getForms = async (user) => await getCollection('forms', user);
async function getForm(formId) {
    try {
        // Get the reference to the specific form document
        const docRef = doc(db, "forms", formId);

        // Get the snapshot of the document
        const docSnap = await getDoc(docRef);

        // Check if the document exists
        if (docSnap.exists()) {
            // Extract the data and include the document ID
            const formData = { id: docSnap.id, ...docSnap.data() };
            return formData;
        } else {
            // Document doesn't exist
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error getting form:", error);
        throw error; // Rethrow the error for handling at a higher level
    }
}
const setForm = async (data, user) => await setDocument('forms', data, user);

// async function updateForm(documentId, data) {
//     try {
//         // Add the current time to the data

//         // Reference to the document
//         const docRef = doc(db, "forms", documentId);
//         const oldData = getForm(documentId)
//         oldData.last_update_on = new Date().getDate().toString() + "/" + (new Date().getMonth() + 1).toString() + "/" + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
//         oldData.title = data.title
//         oldData.description = data.description

//         // Update the document
//         await updateDoc(docRef, oldData);

//         console.log("Document successfully updated!");
//     } catch (error) {
//         console.error("Error updating document: ", error);
//         throw error; // Rethrow the error for handling at a higher level
//     }
// }
const getQuestions = async (formId) => await getCollection('questions', formId);
async function setQuestion(data, formId) {
    try {
        const questionDocRef = await setDocument('questions', data, formId);

        // Update the corresponding form document with the reference to the newly added question
        const formDocRef = doc(db, 'forms', formId);
        await updateDoc(formDocRef, {
            questions: arrayUnion(questionDocRef) // Assuming 'questions' is the field where question references are stored in the form document
        });

        return questionDocRef.id;
    } catch (error) {
        console.error("Set Question Error:", error);
        throw error; // Rethrow the error for handling at higher level
    }
}
const updateQuestion = async (id, data) => await updateDocument('questions', id, data);
const updateForm = async (id, data) => await updateDocument('forms', id, data);
const getResponses = async (formId) => await getCollection('responses', formId);
const setResponse = async (data, formId) => await setDocument('responses', data, formId);
const updateResponse = async (id, data) => await updateDocument('responses', id, data);

export { signUp, signIn, signOutUser, getForms, setForm, updateForm, getQuestions, setQuestion, updateQuestion, getResponses, setResponse, updateResponse };

