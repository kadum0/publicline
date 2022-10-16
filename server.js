
// firebase 
import {createRequire} from 'module'
const require = createRequire(import.meta.url)



//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
//express configuration 
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cors())


////////// pages to send
app.use("/",express.static("./public"))

require("dotenv").config()

import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, useDeviceLanguage} from "firebase/auth"
import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove, DocumentReference} from "firebase/firestore";

// firebase storage; 
import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list} from 'firebase/storage'

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

signInWithEmailAndPassword(publicLineAuth ,process.env.EM, process.env.PW).then((cred)=>{
    // console.log('registered', cred)

onAuthStateChanged(publicLineAuth, async (user)=>{
    if(user){
        // console.log(user, user.uid)
        // user.getIdTokenResult().then(idTokenResult => {console.log('claims are .',idTokenResult.claims)})
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
    // console.log(docs)


        ////
    docs.forEach(e=>{
        // not to allow multiple voting for the route; e.upvotes, e.downvotes
        e.upvotes.forEach(ee=>{
            if(e.downvotes.includes(ee)){
                // not good user; delete 
                let userNameIndex = e.downvotes.indexOf(e.downvotes.filter(ev=>ev==ee));
                e.downvotes.splice(userNameIndex, 1); 
            }
        })

        //////calculate the route 
        // console.log(e)
        if(e.downvotes.length+e.upvotes.length == 20){

            console.log('time to calc')
            if (e.downvotes.length > e.upvotes.length){
                // delete the route 
                deleteDoc(doc(publicLineDb, 'routes', e.id)).then(()=>console.log('deleted'))
            }
        }
    })

    console.log('fired')
})

console.log('nice', 'nice')




// dynamic links 
app.get('/profile/:userName', async (req, res)=>{
    console.log('get profile page', req.params.userName)

    console.log(req)
    
    let data 
    let q = query(collection(publicLineDb, 'users'), where('userName', '==',
    req.params.userName))
    let found = await getDocs(q).then(data=>{

        // console.log(data)
        // console.log(data.docs)

        let docs = []
    data.docs.forEach(doc=>{
        console.log(doc.data())
        docs.push({...doc.data(), id: doc.id})
        data = docs[0]
        data.subproject = 'publicline'
    })
    
    // also to give the project name 

    res.render('profile.ejs', {data})
    })

    // console.log(found)
})

app.listen(process.env.PORT || 1000, ()=>console.log("listennig on port 1000..."))
