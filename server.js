
// firebase 
import {createRequire} from 'module'
const require = createRequire(import.meta.url)



//express tools and configuring
let express = require("express")
let app = express()
let cors = require("cors")
//express configuration 
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


const bygreenConfig = {
    apiKey: "AIzaSyDqK1z4fd7lO9g2ISbf-NNROMd7xpxcahc",
    authDomain: "bygreen-453c9.firebaseapp.com",
    projectId: "bygreen-453c9",
    storageBucket: "bygreen-453c9.appspot.com",
    messagingSenderId: "19954598250",
    appId: "1:19954598250:web:ba57c792bdf65dbc18a513",
    measurementId: "G-265TN8HGKX"
};

const bygreen = initializeApp(bygreenConfig, 'bygreen');
const bygreenDb = getFirestore(bygreen)
const bygreenAuth = getAuth(bygreen)


signInWithEmailAndPassword(bygreenAuth ,process.env.EM, process.env.PW).then((cred)=>{
    // console.log('registered', cred)

onAuthStateChanged(bygreenAuth, async (user)=>{
    if(user){
        // console.log(user, user.uid)
        // user.getIdTokenResult().then(idTokenResult => {console.log('claims are .',idTokenResult.claims)})
    }})
})

///////////on db route change; 
///check if the upvote and downvote equal to 10; then if up; null, if down delete

onSnapshot(collection(bygreenDb, 'routes'), (data)=>{
    let docs = []
    data.docs.forEach(doc=>{
        docs.push({...doc.data(), id: doc.id})
    })

    docs.forEach(e=>{
        // not to allow multiple voting by the same account for the route; e.upvotes, e.downvotes
        e.upvotes.forEach(ee=>{
            if(e.downvotes.includes(ee)){
                // not good user; delete 
                let userNameIndex = e.downvotes.indexOf(e.downvotes.filter(ev=>ev==ee));
                e.downvotes.splice(userNameIndex, 1); 
            }
        })

        //////calculate the route 
        // console.log(e)
        if(e.downvotes.length+e.upvotes.length == 10){

            console.log('time to calc')
            if (e.downvotes.length > e.upvotes.length){
                // delete the route 
                deleteDoc(doc(bygreenDb, 'routes', e.id)).then(()=>console.log('deleted'))
            }
        }
    })
    console.log('got the routes and calculated them')
})

app.use('/', express.static('./home'))
app.use('/location/:coordinates',express.static('./home'))

app.get('/trying', (req, res)=>{
    console.log('server is live')
    res.send('server is live')
})
// to route into ivc
// app.use('/profile/:username',express.static('profile'))


        addDoc(collection(bygreenDb, 'trying'), {server: 'live and good'}).then(e=>{
            console.log('sent the trying to server')
        })


app.listen(process.env.PORT || 3000, ()=>console.log("listennig on port 3000..."))
