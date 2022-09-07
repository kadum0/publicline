

// firebase 

import { initializeApp } from "firebase/app";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword} from "firebase/auth"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";

// firebase storage; 
import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list} from 'firebase/storage'


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getFirestore, collection, onSnapshot, doc, getDocs, getDoc, addDoc, deleteDoc, setDoc, query, where, orderBy, serverTimestamp, updateDoc } from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const publicLineConfig = {
//   apiKey: "AIzaSyApbg3hYeFDQyE7c8r6Y9jf46sC6OkBBVc",
//   authDomain: "fir-learning-51196.firebaseapp.com",
//   projectId: "fir-learning-51196",
//   storageBucket: "fir-learning-51196.appspot.com",
//   messagingSenderId: "185617507245",
//   appId: "1:185617507245:web:5dd806dd7144116d4db724",
//   measurementId: "G-ZB3PEXP3GM"
// };

const publicLineConfig = {
    apiKey: "AIzaSyAF-kHhmhnZ2z6GDRhX3YK6ZeN1wQifC8M",
    authDomain: "public-line-19206.firebaseapp.com",
    projectId: "public-line-19206",
    storageBucket: "public-line-19206.appspot.com",
    messagingSenderId: "897098333489",
    appId: "1:897098333489:web:883a9eaff7711d7c4ec410",
    measurementId: "G-PLWGYD6KBC"
};

// Initialize Firebase
const publicLine = initializeApp(publicLineConfig);
const publicLineDb = getFirestore(publicLine)
const publicLineAuth = getAuth(publicLine)


// make server account; claim token; 

signInWithEmailAndPassword(publicLineAuth ,'server@ivc.com', 'thesecretword').then((cred)=>{
    console.log('registered', cred)
    // cred.idToken.getIdTokenResult().then(idTokenResult => {console.log(idTokenResult.claims)})
    // cred.getIdTokenResult().then(idTokenResult => {console.log(idTokenResult.claims)})

onAuthStateChanged(publicLineAuth, async (user)=>{
    if(user){
        console.log(user, user.uid)
        user.getIdTokenResult().then(idTokenResult => {console.log('claims are .',idTokenResult.claims)})
    }})
})





///////////on db route change; 
///check if the upvote and downvote equal to 10; then if up; null, if down delete


let collectionRef = collection(publicLineDb, 'routes')
onSnapshot(collectionRef, (data)=>{
    let docs = []
    data.docs.forEach(doc=>{
        docs.push({...doc.data(), id: doc.id})
    })
    console.log(docs)


        ////make the basic routes calc
    docs.forEach(e=>{
        // not to allow multiple voting for the route; e.upvotes, e.downvotes
        e.upvotes.forEach(ee=>{
            if(e.downvotes.includes(ee)){
                // not good user; delete 
                let userNameIndex = colors.indexOf(e.downvotes.filter(ev=>ev==ee));
                colors.splice(userNameIndex, 1); 
            }
        })

        //////calculate the route 
        if(e.downvotes.length+e.upvotes.length == 20)
        if (e.downvotes.length > e.downvotes.length){
            // delete the route 
        }
    })

    console.log('fired')
})


console.log('nice', 'nice')

