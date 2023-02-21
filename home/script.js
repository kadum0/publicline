

// firebase 

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove, FieldValue } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

// firebase storage; 
import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js'
    

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
const bygreenStorage = getStorage(bygreen)

/////////auth state 

// let greenColor = '#27F060'
let lightGreen = '#27f060'
let greenColor = "#68F690"
let darkerGreenColor = '#21C24F'

// let blueColor = '#3388FF'
let blueColor = '#198CD4'
let darkerBlueColor = '#075FDA'
let redColor = '#ff2a2a'

// green; #1EF738


// governates coordinates; 




// map configure
const map = L.map('map', { zoomControl: false }).setView([33.396600, 44.356579], 10); 
L.Control.geocoder().addTo(map);

let apiKey = 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA'

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(map);

        let bluePin = L.icon({
            iconUrl: "./imgs/blue-stroked-pin-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            // iconAnchor: [12, 41],
            iconAnchor: [12, 35],
            popupAnchor: [0, -30] 

        });
        let greenPin = L.icon({
            iconUrl: "./imgs/green-stroked-pin-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [0, -30] 
        });

        let sindibad = L.icon({
            iconUrl: "./imgs/sindibad-basic-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [70, 60],
            iconAnchor: [12, 41],
            popupAnchor: [0, 0] 

        });





let dbUser ////firestore account 
let authUser ///auth account
// let type
let accountsList = []

let tempMarker 

const provider = new GoogleAuthProvider()


////////////////////////////////////////////////ui-js



///////register 
document.querySelector('#registerBtn').addEventListener('click', (ev)=>{
    // check if valid data

    // send 
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 0){

        console.log('make account')
        document.querySelector('#greenMessage').style.display = 'block'
        createUserWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
            console.log(cred)
            setTimeout(() => {
                document.querySelector('#greenMessage').style.display = 'none'
            }, 2000);
        }).catch(err=>{
            console.log(err.message)
            document.querySelector('#errors').textContent = err.message
            document.querySelector('#errors').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#errors').style.display = 'none'
            }, 10000);
        })
    }else{

    }
    // empty 
    document.querySelector('#registerUsername').value = ''
    document.querySelector('#registerPassword').value = ''
})

//////signin
document.querySelector('#signinBtn').addEventListener('click', (ev)=>{
    console.log('to sign in')
    console.log(ev.target.parentElement)
    // console.log('click signin', document.querySelector('#signinUsername').value.length)
    // console.log(document.querySelector('#signinUsername').value.length >0)

    // send 
    if(document.querySelector('#signinUsername').value.length > 0 && document.querySelector('#signinPassword').value.length > 0){
        document.querySelector('#greenMessage').style.display = 'block'
        console.log('make account')
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value).then(()=>{
            setTimeout(() => {
                document.querySelector('#greenMessage').style.display = 'none'
            }, 2000);
    
    
        })
    }else{

    }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})

//////signout 
document.querySelector('#signoutBtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result); location.reload();})
})
document.querySelector('#halfLoggedSignoutBtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result); location.reload()})
})

// sign with google  
document.querySelector('#byGoogle').addEventListener('click', ()=>{
    signInWithPopup(bygreenAuth, provider).then((cred)=>console.log(cred))
})

//////make profile; 
document.querySelector('#makeProfileBtn').addEventListener('click', async (ev)=>{
    //////////set user in the users collection user current user uid 
    let q = query(collection(bygreenDb, 'users'), where('username', '==', ev.target.parentElement.querySelector('#username').value))
    let foundDoc = await getDocs(q)
    let found

    foundDoc.forEach(e=>{
        found = doc.data()
        console.log(doc.id, doc.data())
    })
    console.log(foundDoc, found)
    if(!found){
        console.log('no taken')

        let fileRef = ref(bygreenStorage, '/user-imgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userImg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userImg").files[0]).then(res=>{
                getDownloadURL(res.ref).then(url=>{
                    console.log(url)
                    let imgUrl = url

        ///addDoc; add document to a collection; 
        setDoc(doc(bygreenDb, 'users', authUser.uid), {
            userName: ev.target.parentElement.querySelector('#username').value,
            name: ev.target.parentElement.querySelector('#name').value,
            bio: ev.target.parentElement.querySelector('#bio').value,
            img: imgUrl,
            red: [],
            green: [],
            yellow:[],
            addedRoutes: [], 
            votes: [],
            type: 'user'
        }).then(()=>{window.location.reload();}) 
        })
    })


    // setDoc(doc(bygreenDb, 'users', currentUser.uid), {name: ev.target.querySelector('username').value})
    
}else{
        //////////make messaga section to display errors 
        console.log('username already taken')
    }

})





//////////////////ui-js; 
document.querySelector("#miniProfileDi").addEventListener("click", (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelector("#miniProfile").style.display = 'block'
    }else{
        document.querySelector("#miniProfile").style.display = 'none'
    }
})

document.querySelector('#asideDi').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('red')
    ev.target.classList.contains('red')?document.querySelector('aside').style.display = 'flex':document.querySelector('aside').style.display = 'none'
})


    document.querySelector('#makeLocLink').addEventListener('click', (ev)=>{ev.target.classList.toggle('on')})

    document.querySelector("#addRouteMode").addEventListener("click", (ev)=>{
            ev.target.classList.toggle("on")
            if(ev.target.classList.contains('on')){
            document.querySelector('#newRouteDetails').style.display='flex'
            ////delete all routes 
            map.removeLayer(hoveredRoute)
            routesObjects.forEach(route=>map.removeLayer(route))
            circlesObjects.forEach(circle=>map.removeLayer(circle))

            // routesObjects.forEach(ee=>{ee.setStyle({opacity:0, interactive: false})})
            // circlesObjects.forEach(ee=>{ee.setStyle({opacity:0, interactive: false})})

            }else{
                deployRoutes(routes)
                // addRouteMode.style.backgroundColor = '#54db7b'
                document.querySelector('#newRouteDetails').style.display='none'
            }
    })



    ///////////////////////// ui-js-data
    // ranking options

//leaflet basic map
map.on('zoomend', function () {
    // let currentZoom = map.getZoom();
    console.log('current zoom;',map.getZoom()  , map.getBounds())
    routesObjects.forEach(route=>{
    if(map.getZoom() == 10){
        route.setStyle({weight: 5})
    }else if(map.getZoom() == 11){
        route.setStyle({weight: 10})
    }else if(map.getZoom() == 12){
        route.setStyle({weight: 15})
    }else if(map.getZoom() == 13){
        route.setStyle({weight: 20})
    }else if(map.getZoom() == 14){
        route.setStyle({weight: 25})
    }
    })
});


totalSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('total', 'ac'):ranking('total', 'de')
})
addedRoutesSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('addedRoutes', 'ac'):ranking('addedRoutes', 'de')
})
votesSorting.addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    ev.target.classList.contains('on')?ranking('votes', 'ac'):ranking('votes', 'de')
})


// display routes buttons


displayCompletedRoutes.addEventListener('click', (ev)=>{
    console.log("display completed routes ")
    ev.target.classList.toggle('on2')
    if(ev.target.classList.contains('on2')){
        console.log(completedRoutes, completedRoutesObjects, circlesObjects)
        completedRoutesObjects.forEach(routeObj=>{

            circlesObjects.forEach(circleObj=>{
                if(JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[0]) || JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[routeObj._latlngs.length-1])){
                    circleObj.addTo(map)
                }
            })

            routeObj.addTo(map)
        })

    }else{
        console.log(completedRoutes, completedRoutesObjects, circlesObjects)


        completedRoutesObjects.forEach(routeObj=>{
            circlesObjects.forEach(circleObj=>{
                console.log(circleObj._latlng, routeObj._latlngs[0], )
                if(JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[0]) || JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[routeObj._latlngs.length-1])){
                    console.log('remove circle; ', circleObj)
                    map.removeLayer(circleObj)
                }
            })

            map.removeLayer(routeObj)
        })
            
    }
})

displayUncompletedRoutes.addEventListener('click', (ev)=>{
    console.log("display uncompleted routes ")
    ev.target.classList.toggle('on2')
    if(ev.target.classList.contains('on2')){
        console.log(uncompletedRoutes, uncompletedRoutesObjects, circlesObjects)
        uncompletedRoutesObjects.forEach(routeObj=>{

            circlesObjects.forEach(circleObj=>{
                if(JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[0]) || JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[routeObj._latlngs.length-1])){
                    circleObj.addTo(map)
                }
            })

            routeObj.addTo(map)
        })

    }else{
        console.log(uncompletedRoutes, uncompletedRoutesObjects, circlesObjects)


        uncompletedRoutesObjects.forEach(routeObj=>{
            circlesObjects.forEach(circleObj=>{
                console.log(circleObj._latlng, routeObj._latlngs[0], )
                if(JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[0]) || JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[routeObj._latlngs.length-1])){
                    console.log('remove circle; ', circleObj)
                    map.removeLayer(circleObj)
                }
            })

            map.removeLayer(routeObj)
        })
            
    }
})

displayConfirmedRoutes.addEventListener('click', (ev)=>{
    console.log("display confirmed routes ")
    ev.target.classList.toggle('on2')
    if(ev.target.classList.contains('on2')){
        console.log(confirmedRoutes, confirmedRoutesObjects, circlesObjects)
        confirmedRoutesObjects.forEach(routeObj=>{

            circlesObjects.forEach(circleObj=>{
                if(JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[0]) || JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[routeObj._latlngs.length-1])){
                    circleObj.addTo(map)
                }
            })

            routeObj.addTo(map)
        })

    }else{
        console.log(confirmedRoutes, confirmedRoutesObjects, circlesObjects)


        confirmedRoutesObjects.forEach(routeObj=>{
            circlesObjects.forEach(circleObj=>{
                console.log(circleObj._latlng, routeObj._latlngs[0], )
                if(JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[0]) || JSON.stringify(circleObj._latlng) == JSON.stringify(routeObj._latlngs[routeObj._latlngs.length-1])){
                    console.log('remove circle; ', circleObj)
                    map.removeLayer(circleObj)
                }
            })

            map.removeLayer(routeObj)
        })
            
    }
})



selectGovernate.addEventListener('change', (ev)=>{
    console.log('options', ev.target.value)

    let currentGov
    function saveGov(coords){
        localStorage.setItem('clientLoc', coords)
    }

    // the most in numbers; main 
    if(ev.target.value=='baghdad'){
        console.log("this is baghdad")
        map.flyTo([33.396600, 44.356579], 10)
        localStorage.setItem('clientLoc', [33.396600, 44.356579])
    }else if(ev.target.value == 'basra'){
        map.flyTo([30.534238, 47.764500], 10)
        localStorage.setItem('clientLoc', [30.534238, 47.764500])
    }else if(ev.target.value == 'nineveh'){
        map.flyTo([36.346197, 43.158618], 10)
        localStorage.setItem('clientLoc', [36.346197, 43.158618])
    }else if(ev.target.value == 'sulaymaniyah'){
        map.flyTo([35.560957, 45.414252], 10)
        localStorage.setItem('clientLoc', [35.560957, 45.414252])
    }else if(ev.target.value == 'anbar'){
        map.flyTo([33.422346, 43.268823], 10)
        localStorage.setItem('clientLoc', [33.422346, 43.268823])
    }else if(ev.target.value == 'karbala'){
        map.flyTo([32.601386, 44.018819], 10)
        localStorage.setItem('clientLoc', [32.601386, 44.018819])
    }else if(ev.target.value == 'erbil'){
        map.flyTo([36.188488, 44.013199], 10)
        localStorage.setItem('clientLoc', [36.188488, 44.013199])
    }else if(ev.target.value == 'babil'){
        map.flyTo([32.471120, 44.426321], 10)
        localStorage.setItem('clientLoc', [32.471120, 44.426321])
    }else if(ev.target.value == 'najaf'){
        map.flyTo([32.001916, 44.331424], 10)
        localStorage.setItem('clientLoc', [32.001916, 44.331424])
    }else if(ev.target.value == 'dhi-qar'){
        map.flyTo([31.040835, 46.249916], 10)
        localStorage.setItem('clientLoc', [31.040835, 46.249916])
    }else if(ev.target.value == 'dohuk'){
        map.flyTo([36.862733, 42.991273], 10)
        localStorage.setItem('clientLoc', [36.862733, 42.991273])
    }else if(ev.target.value == 'kirkuk'){
        map.flyTo([35.470205, 44.390994], 10)
        localStorage.setItem('clientLoc', [35.470205, 44.390994])
    }else if(ev.target.value == 'saladin'){
        map.flyTo([34.596914, 43.676320], 10)
        localStorage.setItem('clientLoc', [34.596914, 43.676320])
    }else if(ev.target.value == 'diyala'){
        map.flyTo([33.741855, 44.613693], 10)
        localStorage.setItem('clientLoc', [33.741855, 44.613693])
    }else if(ev.target.value == 'wasit'){
        map.flyTo([32.516900, 45.816420], 10)
        localStorage.setItem('clientLoc', [32.516900, 45.816420])
    }else if(ev.target.value == 'maysan'){
        map.flyTo([31.838153, 47.144565], 10)
        localStorage.setItem('clientLoc', [31.838153, 47.144565])
    }else if(ev.target.value == 'al-qadisiyyah'){
        map.flyTo([31.987575, 44.917299], 10)
        localStorage.setItem('clientLoc', [31.987575, 44.917299])
    }else if(ev.target.value == 'muthanna'){
        map.flyTo([31.313330, 45.281570], 10)
        localStorage.setItem('clientLoc', [31.313330, 45.281570])
    }else if(ev.target.value == 'halabja'){
        map.flyTo([35.177346, 45.992220], 10)
        localStorage.setItem('clientLoc', [35.177346, 45.992220])
    }

    // ev.target.value == 'baghdad'?map.flyTo([33.314644, 44.420873], 10):null
})

document.querySelector('#translateToEn').addEventListener('click', (ev)=>{
    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        document.querySelectorAll('.en').forEach((enElement)=>enElement.style.display='block')
        document.querySelectorAll('.ar').forEach((arELement)=>arELement.style.display='none')
        ev.target.textContent = 'ar'
    }else{
        document.querySelectorAll('.en').forEach((enElement)=>enElement.style.display='none')
        document.querySelectorAll('.ar').forEach((arELement)=>arELement.style.display='block')
        ev.target.textContent = 'en'
    }
})



let myLoc 
let myPin

let watchID

findMe.addEventListener('click', (ev)=>{

    ev.target.classList.toggle('on')
    if(ev.target.classList.contains('on')){
        // add marker and circle

        console.log("find me ...", navigator.geolocation)
        // internet based; 
        // no need to check and cant check 
        if(navigator.geolocation){

            console.log("navi, geolo")

        // get into the locatoin
        navigator.geolocation.getCurrentPosition(pos=>{
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 12)
        })
    
        watchID = navigator.geolocation.watchPosition((pos)=>{
            console.log('watching; ',pos.coords.latitude, pos.coords.longitude)
            
            myPin?map.removeLayer(myPin):null
            myLoc?map.removeLayer(myLoc):null
    
            myLat = pos.coords.latitude
            myLon = pos.coords.longitude
    
            myPin = L.marker([pos.coords.latitude, pos.coords.longitude], {icon: sindibad}).addTo(map)
            myLoc = L.circle([pos.coords.latitude, pos.coords.longitude], {color: darkerBlueColor, radius: 100}).addTo(map)
            
            localStorage.setItem('clientLoc', [pos.coords.latitude, pos.coords.longitude])

            // map.flyTo([pos.coords.latitude, pos.coords.longitude], 16)
    
            // setView([pos.coords.latitude, pos.coords.longitude])
        }, (err)=>{
            console.log("gps not enabled")
            // alert('geolocation is not enabled')
            if(navigator.onLine){

                console.log('online')

                fetch('https://ipapi.co/json/')
                .then(res=>res.json())
                .then(data=>{
                    console.log('got online loc;', data)
                    map.flyTo([data.latitude, data.longitude], 12)
                    myPin = L.marker([data.latitude, data.longitude], {icon: sindibad}).addTo(map)
                    myLoc = L.circle([data.latitude, data.longitude], {color: darkerBlueColor, radius: 100}).addTo(map)

                    localStorage.setItem('clientLoc', [data.latitude, data.longitude])
        
                    console.log(myPin, myLoc)
                })

                document.querySelector('#redMessage').textContent = 'enable gps for more accurate results'
                document.querySelector('#redMessage').style.display = 'block'
                setTimeout(() => {
                    document.querySelector('#redMessage').style.display = 'none'
                }, 2000);

        // no permisson case
            }else{
                document.querySelector('#redMessage').textContent = 'no gps and no internet connection'
            document.querySelector('#redMessage').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#redMessage').style.display = 'none'
                
            }, 3000);
    
        // give the previous saved location
        // if(myLat && myLon){
        //     console.log('geolocation is enabled')
        //     map.flyTo([myLat, myLon], 16)
        // }
            }
    
        })
    

        }else{

            // check if online
            
// to enable gps for better and more accurate location detecting

    
        }

    }else{
        // remove marker and circle, and stop watching 
        navigator.geolocation.clearWatch(watchID);
        map.removeLayer(myLoc)
        map.removeLayer(myPin)

    }
})




        /////////////////////////////////get data 

        let hoveredRoute 
        let hoveredstart
        let hoveredend
        let type

        let routes 
        let currentRouteId

        let completedRoutes
        let uncompletedRoutes
        let confirmedRoutes


        onAuthStateChanged(bygreenAuth, async (user)=>{

            document.querySelector('#greenMessage').style.display = 'block'

            // get into client stored location 
            console.log('client loc is; ',localStorage.getItem('clientLoc'))
            map.flyTo([localStorage.getItem('clientLoc').split(',')[0], localStorage.getItem('clientLoc').split(',')[1]], 12)


            console.log('authstatefun', dbUser)
            // side custom 
            if(window.location.href.includes('location')){
            console.log('contains temp pin', window.location.href.indexOf('location'), window.location.href.slice(0, window.location.href.indexOf('location')))

            // make the pin
            let currentPin = L.marker({
        lat: window.location.href.split('/')[window.location.href.split('/').length-2].split(',')[0],
        lng: window.location.href.split('/')[window.location.href.split('/').length-2].split(',')[1]
        }, {icon: greenPin}).addTo(map)

            // flyto it 
            console.log(currentPin)
            map.flyTo(currentPin._latlng, 16)

                }


    // if visiting the website for the first time will get into some instructions
    if (localStorage.getItem("firstVisit") === null) {
        // This is the user's first visit
        console.log("first time to visit the site; then to show instructions")
        document.querySelector('#redArrow').style.display = 'block'
        // document.querySelector('#asideDi').classList.toggle('red')
        // document.querySelector('#asideDi').classList.contains('red')?document.querySelector('aside').style.display = 'flex':document.querySelector('aside').style.display = 'none'

        setTimeout(() => {
            // document.querySelector("#features").scrollIntoView({
            //     behavior: "auto",
            //     block: "center"
            // })

            // document.body.scrollIntoView({ behavior: 'smooth', block: 'end'
            // });
            
            // window.scrollTo(0, document.body.scrollHeight);

            document.querySelector('#redArrow').style.display = 'none'
        }, 3000)

        localStorage.setItem("firstVisit", false)
    } else {
        // This is not the user's first visit
    }

            if(user){
                console.log('from auth ', user)
                authUser = user
                user.getIdTokenResult().then(idTokenResult => {
                    console.log('claims', idTokenResult.claims)
                    type = idTokenResult.claims
                    // if team 
                    if (idTokenResult.claims.team){
                    document.querySelectorAll('.teamEle').forEach(teamEle=>teamEle.style.display = 'inline-block')
                    }
                })
        
                let dbUserDoc = await getDoc(doc(bygreenDb, 'users', user.uid))
                dbUser = dbUserDoc.data()
                
                if(dbUser){
                dbUser.id = dbUserDoc.id
        
                    ////registered
                    document.querySelectorAll('.logged').forEach(e=>{e.style.display = 'block'})
                    document.querySelectorAll('.halfLogged').forEach(e=>e.style.display = 'none')
                    document.querySelectorAll('.notLogged').forEach(e=>e.style.display = 'none')
        
                    // di
                    document.querySelector('#currentAccountImgDi').style.backgroundImage = `url('${dbUser.img}')`
                    document.querySelector("#currentAccountUsernameDi").textContent = '@'+ dbUser.userName
        
                    // mini
                    document.querySelector('#currentAccountImgMini').style.backgroundImage = `url('${dbUser.img}')`
                    document.querySelector("#currentAccountUsernameMini").textContent = '@'+ dbUser.userName
                    document.querySelector("#currentAccountName").textContent = dbUser.name
                    document.querySelector("#currentAccountBio").textContent = dbUser.bio
                    document.querySelector("#currentAccountLink").href = `https://kadum2.github.io/ivc/profile/${dbUser.userName}`
        
                }else{
                    /////half registered; make profile
                    document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
                    document.querySelectorAll('.halfLogged').forEach(e=>e.style.display = 'block')
                    document.querySelectorAll('.notLogged').forEach(e=>e.style.display = 'none')
                }
                
            }else{
                /////not registered
                document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
                document.querySelectorAll('.halfLogged').forEach(e=>e.style.display = 'none')
                document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
                dbUser = 'none'
            }

            getDocs(collection(bygreenDb, 'users')).then((data)=>{

                setTimeout(() => {
                    document.querySelector('#greenMessage').style.display = 'none'
                }, 1000);

                let docs = []
                    data.docs.forEach(doc=>{
                        docs.push({...doc.data(), id: doc.id})
                    })
                    accountsList = docs
                    console.log(docs)
                    document.querySelector('#accountsCounter').textContent = accountsList.length
                    if(accountsList){
                        // console.log(accountsList, dbUser)
                        ranking('total', 'de')
                    }
            })

            getDocs(collection(bygreenDb, 'newroutes')).then((data)=>{
                let docs = []
                    data.docs.forEach(doc=>{
                        docs.push({...doc.data(), id: doc.id})
                    })
                    routes = docs
    
                    navigator.onLine?localStorage.setItem('routes', JSON.stringify(routes)):routes = JSON.parse(localStorage.getItem("routes") || "[]")
    
                    console.log(docs)
    
                    document.querySelector('#routesCounter').textContent = docs.length
                    let votes = 0
                    docs.forEach(route=> votes += (route.upvotes.length + route.downvotes.length))
                    // document.querySelector('#votesCounter').textContent = docs.filter
                    document.querySelector('#votesCounter').innerHTML = votes
    
                    document.querySelector('#greenMessage').style.display = 'none'

                    completedRoutes = routes.filter(route=> route.start && route.end && !route.confirmed)
                    uncompletedRoutes = routes.filter(route=>!route.start || !route.end && !route.confirmed)
                    confirmedRoutes = routes.filter(route=>route.confirmed)
                
                    routes.forEach(route=>console.log(!route.confirmed))
        
                deployRoutes(completedRoutes)
                displayCompletedRoutes.classList.toggle('on2')
                deployRoutes(uncompletedRoutes)
                displayUncompletedRoutes.classList.toggle('on2')

                deployRoutes(confirmedRoutes)
                displayConfirmedRoutes.classList.toggle('on2')
                    
                // console.log(confirmedRoutes)
                // console.log('completed routes',completedRoutes)
            })

            let visitor
            fetch('https://ipapi.co/json')
            .then(response => response.json())
            .then(async (data) => {
                visitor = data
                console.log('my ip', data);


            // check if the object with same ip does exist; if does add to visits counter, if not make new object with ip prop and visits prop 

            // method; check if exist

            // // const q = query(dbRef, orderByValue(), equalTo(testURL));
            // let q = query(collection(bygreenDb, 'visitors'), where('ip', '==', visitor.ip))
            // const snapshot = await getDocs(q);
            // let found
            // snapshot.forEach(e=>{found = e.data(); found.id = e.id})

            // console.log(found)


            // if (found) {
            // // add to it

            // console.log('data does exist; Results', found)
            // // let newVisits = found.visits+1
            //     updateDoc(doc(bygreenDb, "visitors", found.id), {visits: found.visits+1}).then(()=>console.log('updated the doc'))

            // } else {
            //     // make new one
            // console.log('Data does not exist')
            // addDoc(collection(bygreenDb, 'visitors'), {ip: visitor.ip, visits: 0}).then(()=>console.log('added the new visitor to the log'))
            // }

            // method; make docuement with ip to be the id by set method

            // let docRefr = doc(bygreenDb, 'visitors', visitor.ip)
            // setDoc(docRefr, {visits: 10}, {merge: true}).then(e=>{
            //     // document.querySelector('#greenMessage').textContent = 'sent'
            //     console.log('set new visitor', visitor.ip)
            //     // location.reload()

            // }).catch((err)=>{
            //     console.log(err)
            //     // add to this visitor counter 
            //     // updateDoc(doc(bygreenDb, 'visitors', visitor.ip), {visits: })
            // })

            // method update first if error to set the document 
            // updateDoc(doc(bygreenDb, 'visitors', visitor.ip), {visits: FieldValue.increment(1)})
            // .then(()=>{
            //     console.log("updated the document visitor")
            // }).catch(err=>{
            //     console.log('not exist to update; ')
            // })

            })

            // data statics 
            getDocs(collection(bygreenDb, 'pins')).then((data)=>{
        let docs = []
            data.docs.forEach(doc=>{
                docs.push({...doc.data(), id: doc.id})
            })

            let red = 0
            let green = 0
            let yellow = 0
            let redToGreen = 0

            docs.forEach(generalPin=>{
                generalPin.afterImgs?red++:green++
                generalPin.next?yellow++:null
                generalPin.redToGreen?redToGreen++:null
            })

            document.querySelector('#redCounter').textContent = red
            document.querySelector('#greenCounter').textContent = green
            document.querySelector('#yellowCounter').textContent = yellow
            // document.querySelector('#redToGreenCounter').textContent = green
            })

            getDocs(collection(bygreenDb, 'shop')).then((data)=>{
    let docs = []
        data.docs.forEach(doc=>{
            docs.push({...doc.data(), id: doc.id})
        })
        // console.log(docs[0].upvotes.length + docs[0].downvotes)
        document.querySelector('#shopsCounter').textContent = docs.length
            })

        })

        //////////////////////////////send data 

        //////////collect (get) data 

        /////containers; 
        let completedRoutesObjects = []
        let uncompletedRoutesObjects = []
        let confirmedRoutesObjects = []

        let circlesObjects = []

        let routesObjects = [] ///to hover and change color; check more about
        let markers = [] /// list of the labels object
        //path 
        let path = [] ///path points
        let currentPath = [] //path object

        //circles
        let start 
        let end 


        // make the main route
        map.addEventListener('click', function (ev) {
            if(document.querySelector("#addRouteMode").classList.contains("on")){
                /////////disable all routes 
                // routesObjects.forEach(ee=>{ee.setStyle({opacity:0, interactive: false})})
                // circlesObjects.forEach(ee=>{ee.setStyle({opacity:0, interactive: false})})
                console.log('routes; ',routesObjects)
                console.log('circles; ', circlesObjects)

                ////get data 
                let latlng = map.mouseEventToLatLng(ev.originalEvent);
                console.log(latlng)

                ////make 
                let m = L.marker(latlng, {
                    icon: bluePin
                }).addTo(map);
                markers.push(m) 


                ////content; no need; current label ??

                /////insert 
                ////js 
                path.push(latlng)
                ////ui 
                currentPath != 0 ? map.removeLayer(currentPath) : null
                currentPath = L.polyline(path).setStyle({color: darkerGreenColor}).addTo(map)
            }else{

                if(document.querySelector('#makeLocLink').classList.contains("on")){

                // add direct pin and link to share
                tempMarker?map.removeLayer(tempMarker):null

                if(window.location.href.includes('location')){
                    // tempMarker = L.marker(map.mouseEventToLatLng(ev.originalEvent), {icon: greenPin}).bindPopup(`link; <br><a href='${window.location.href.slice(0, window.location.href.indexOf('location'))+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng}/'>${window.location.href.slice(0, window.location.href.indexOf('location'))+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng}/</a>`).addTo(map)
                    
                    let makeLocDiv = document.createElement('div')

                    let linkElement = document.createElement('a')
                    linkElement.setAttribute('href', window.location.href.slice(0, window.location.href.indexOf('location'))+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng)
                    linkElement.textContent = '...link'

                    let copyBtn = document.createElement('button')
                    copyBtn.classList.add('box')
                    copyBtn.textContent = 'copy'

            let textToCopy = window.location.href.slice(0, window.location.href.indexOf('location'))+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng+'/'

            copyBtn.addEventListener("click", ()=>{
                navigator.clipboard.writeText(textToCopy).then(function() {
                document.querySelector('#copyMessage').style.display = 'block'

                setTimeout(() => {
                    document.querySelector('#copyMessage').style.display = 'none'
                    
                }, 2000);
                }, function(err) {
                console.error("Failed to copy text: ", err);
                });
            });

                    makeLocDiv.append(copyBtn, linkElement)

                    tempMarker = L.marker(map.mouseEventToLatLng(ev.originalEvent), {icon: greenPin}).bindPopup(makeLocDiv).addTo(map)


                }else{

                        // github 
                                if(window.location.href.includes('github')){

                                    // tempMarker = L.marker(map.mouseEventToLatLng(ev.originalEvent), {icon: greenPin}).bindPopup(`link; for github <br><a href='https://kadum2.github.io/publicline${'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng}/'>${'https://kadum2.github.io/publicline/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng}/</a> <br> something`).addTo(map)

                                    // https://kadum2.github.io/publicline

                                    
                                    let makeLocDiv = document.createElement('div')

                                    let linkElement = document.createElement('a')
                                    linkElement.setAttribute('href', 'https://kadum2.github.io/publicline'+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng)
                                    linkElement.textContent = '...link'

                                    let copyBtn = document.createElement('button')
                                    copyBtn.classList.add('box')
                                    copyBtn.textContent = 'copy'

                            let textToCopy = 'https://kadum2.github.io/publicline'+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng+'/'

                            copyBtn.addEventListener("click", ()=>{
                                console.log("clicked on copy")
                                navigator.clipboard.writeText(textToCopy).then(function() {
                                document.querySelector('#copyMessage').style.display = 'block'

                                setTimeout(() => {
                                    document.querySelector('#copyMessage').style.display = 'none'
                                    
                                }, 2000);
                                }, function(err) {
                                console.error("Failed to copy text: ", err);
                                });
                            });

                            makeLocDiv.append(copyBtn, linkElement)

                            tempMarker = L.marker(map.mouseEventToLatLng(ev.originalEvent), {icon: greenPin}).bindPopup(makeLocDiv).addTo(map)

                                }else{

                                    let makeLocDiv = document.createElement('div')

                                    let linkElement = document.createElement('a')
                                    linkElement.setAttribute('href', window.location.hostname+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng)
                                    linkElement.textContent = '...link'

                                    let copyBtn = document.createElement('button')
                                    copyBtn.classList.add('box')
                                    copyBtn.textContent = 'copy'

                            let textToCopy = window.location.hostname+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng+'/'

                            copyBtn.addEventListener("click", ()=>{
                                navigator.clipboard.writeText(textToCopy).then(function() {
                                document.querySelector('#copyMessage').style.display = 'block'

                                setTimeout(() => {
                                    document.querySelector('#copyMessage').style.display = 'none'
                                    
                                }, 2000);
                                }, function(err) {
                                console.error("Failed to copy text: ", err);
                                });
                            });

                                    makeLocDiv.append(copyBtn, linkElement)

                                    tempMarker = L.marker(map.mouseEventToLatLng(ev.originalEvent), {icon: greenPin}).bindPopup(makeLocDiv).addTo(map)

                            }
                
        }
            }else{
            tempMarker?map.removeLayer(tempMarker):null
            }
            }
        });

        /////adding points
        document.querySelector("#start").addEventListener('click', (e)=>{
            e.target.classList.toggle("on")
            if(e.target.classList.contains('on')){
                // get current making route; 
                console.log(currentPath._latlngs[0])
                start = L.circle(currentPath._latlngs[0], {radius: 600, color: darkerGreenColor}).addTo(map)
                // e.target.style.background = '#ff2a2a'
            }else{
                // start.removeLayer(map)/
                map.removeLayer(start)
                // e.target.style.background = '#1bf057'
            }
        })

        document.querySelector("#end").addEventListener('click', (e)=>{
            e.target.classList.toggle("on")
            if(e.target.classList.contains('on')){
                // get current making route; 
                console.log(currentPath._latlngs[currentPath._latlngs.length - 1])
                end = L.circle(currentPath._latlngs[currentPath._latlngs.length - 1], {radius: 600, color: darkerGreenColor}).addTo(map)
                // e.target.style.background = '#ff2a2a'
            }else{
                // start.removeLayer(map)/
                map.removeLayer(end)
                // e.target.style.background = '#1bf057'
            }

        })

        ////cencel step
        
        document.querySelector("#cancel-step").addEventListener("click", () => {
            //ui 

            map.removeLayer(markers[markers.length - 1])

            //data 
            markers.pop()

            path.pop()
            // points.pop()
            map.removeLayer(currentPath)
            currentPath = L.polyline(path, {color: 'red'}).addTo(map)
        })

    ////////////////////////sending 

        document.querySelector("#send").addEventListener("click", () => {

            // if logged send the username with it; 
            // check if data; may make it only available when data set; 
            // make object; 
            let routeToSend = {}
            if(currentPath[0] || document.querySelector('#routeName').value){ /////available data to send; 
                // routeToSend.path = currentPath._latlngs 
                // document.querySelector('#greenMessage').textContent = 'sending'
                document.querySelector('#greenMessage').style.display = 'block'
                
                console.log(currentPath)
                let validRoute = []
                // let notvalidRoute = []
                // currentPath._latlngs.forEach(e=>validRoute.push(e))
                Object.values(currentPath._latlngs).forEach(e=>validRoute.push({lng: e.lng,lat: e.lat}))
                routeToSend.path = validRoute
                routeToSend.name = document.querySelector("#routeName").value
                start?routeToSend.start = true:routeToSend.start = false
                end?routeToSend.end = true:routeToSend.end = false
                routeToSend.upvotes = []
                routeToSend.downvotes = []
                // currentUser?routeToSend.insertedBy = currentUser.email:routeToSend.insertedBy = null

                console.log(routeToSend, typeof routeToSend.route, typeof notvalidRoute)

                //////send; 
                addDoc(collection(bygreenDb, 'unroutes'), routeToSend).then(e=>{
                    // document.querySelector('#greenMessage').textContent = 'sent'
                    location.reload()

                    setTimeout(() => {
                        document.querySelector('#greenMessage').style.display = 'none'
                    }, 1000);

                })
            }else{
                console.log('set the rest data')
                document.querySelector("#redMessage").textContent = 'اكمل ملئ البيانات و اضافة مسار كامل'
                document.querySelector("#redMessage").style.display='block'

                setTimeout(() => {
                    document.querySelector("#redMessage").textContent = ''
                    document.querySelector("#redMessage").style.display='none'
                }, 2000);
            }
    })


    ////////////////////////////functions

    function deployRoutes(ev){
        Object.values(ev).forEach(async e => { 

            /////content 
            let voteBtns = document.createElement('div')
            let routeName = document.createElement('h3')
            routeName.style.display= 'inline'
            let nameDiv = document.createElement('div')
            e.name?routeName.textContent = e.name:routeName.textContent = 'اسم المسار' 
            let checkImg = document.createElement('img')
            checkImg.setAttribute('src', './imgs/general/check-icon.png')
            checkImg.style.height = '1rem'

            // upvote btn
            let upvoteBtn = document.createElement("button")
            upvoteBtn.textContent = 'صحيح'
            upvoteBtn.classList.add("upvoteBtn")
            
            upvoteBtn.addEventListener('click', (ev)=>{
                downvoteBtn.classList.contains('voted')?downvoteBtn.classList.remove('voted'):null
                ev.target.classList.toggle('voted')
                if(ev.target.classList.contains('voted')){
                    sureBtn.removeAttribute('disabled')
                }else{
                    sureBtn.setAttribute('disabled', true)
                }

            })

            // downvote btn
            let downvoteBtn = document.createElement("button")
            downvoteBtn.textContent = 'خاطئ'
            downvoteBtn.classList.add("downvoteBtn")
            // if(currentUser){
            //     e.downvotes.includes(currentUser)?downvoteBtn.style.border = "2px solid blue":null
            // }

            downvoteBtn.addEventListener('click', (ev)=>{
                upvoteBtn.classList.contains('voted')?upvoteBtn.classList.remove('voted'):null
                ev.target.classList.toggle('voted')
                if(ev.target.classList.contains('voted')){
                    sureBtn.removeAttribute('disabled')
                }else{
                    sureBtn.setAttribute('disabled', true)
                }
            })

            let sureDiv = document.createElement('div')
            let sureBtn = document.createElement('button')
            sureBtn.textContent = 'متأكد'
            sureBtn.classList.add('sureBtn')
            sureBtn.setAttribute('disabled', true)
            sureBtn.addEventListener('click', (ev)=>{

                console.log(ev.target,ev.target.parentElement.parentElement,currentRouteId)

                // check what button choosed 
                if(ev.target.parentElement.parentElement.querySelector('.upvoteBtn').classList.contains('voted')){
                    updateDoc(doc(bygreenDb, 'routes', currentRouteId), {upvotes: arrayUnion(dbUser.userName)}).then(()=>{
                        console.log('voted')
                        updateDoc(doc(bygreenDb, 'users', dbUser.id), {votes: arrayUnion(currentRouteId)})
                        console.log('record the vote')
                    })
                }else if(ev.target.parentElement.parentElement.querySelector('.downvoteBtn').classList.contains('voted')){
                    updateDoc(doc(bygreenDb, 'routes', currentRouteId), {downvotes: arrayUnion(dbUser.userName)}).then(()=>console.log('voted'))
                }

                upvoteBtn.setAttribute('disabled', true)
                downvoteBtn.setAttribute('disabled', true)
                ev.target.setAttribute('disabled', true)
            })
            sureDiv.append(sureBtn)

            nameDiv.append(routeName)
            confirmedRoutes.includes(e)?nameDiv.append(checkImg):null

            /////insert
            voteBtns.append(nameDiv, upvoteBtn, downvoteBtn, sureDiv)
                let routeObject = L.polyline(e.path, {color: confirmedRoutes.includes(e)?lightGreen:greenColor}).bindPopup(voteBtns).addTo(map)

                // routeObject.name = e.name
                e.start?circlesObjects.push(L.circle(e.path[0],{radius: 300, color: darkerGreenColor, background: darkerGreenColor}).addTo(map)):null
                e.end?circlesObjects.push(L.circle(e.path[e.path.length-1],{radius: 300, color:darkerGreenColor, background:darkerGreenColor}).addTo(map)):null 
                
                routeObject.upvotes = e.upvotes
                routeObject.downvotes = e.downvotes
                routeObject.id = e.id
                routeObject.start = e.start
                routeObject.end = e.end
                routeObject.confirmed = e.confirmed?true:false
                
            /////content
                ////////////if logged then allow to vote; 
                routeObject.addEventListener('click', (ev)=>{
                    console.log('click on route', ev.target)

                    currentRouteId = e.id

                    ////////mobile; change color 
                    routesObjects.forEach(e=>{e.setStyle({color: greenColor, opacity: .6})})
                    hoveredRoute?map.removeLayer(hoveredRoute):null
                    hoveredRoute = L.polyline(ev.target._latlngs, {color: blueColor, interactive: false})
                    hoveredRoute.addTo(map)
                    hoveredRoute.setStyle({color:blueColor, opacity: 1})


                    if(dbUser != 'none'){
                        console.log(dbUser)
                        if(ev.target.upvotes || ev.target.downvotes){ ///temp
                            console.log('available votes options')
                            if(ev.target.upvotes.includes(dbUser.userName)){
                                console.log('upvoter; ', ev.target.upvotes, ev.target.upvotes.includes(dbUser.userName))
                                ev.target._popup._content.querySelector('.upvoteBtn').style.border = "2px solid blue"

                                ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                                ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                                // downvoteBtn.setAttribute('disabled', true)
    
                            }else if(ev.target.downvotes.includes(dbUser.userName)){
                                console.log('downvoter; ',ev.target.downvotes, ev.target.downvotes.includes(dbUser.userName))
                                ev.target._popup._content.querySelector('.downvoteBtn').style.border = "2px solid blue"

                                ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                                ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                            }
                        }else{
                            console.log('no upvotes option')
                        }

                    }else{
                        // no account
                            // display; have to login to vote 

                        ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                                ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                                // ev.target._popup._content.append('انشئ حساب للتصويت')
                    }

                    e.upvotes?console.log('upvotes', e.upvotes):null
                    e.downvotes?console.log('downvotes', e.downvotes):null
                })

                routeObject._popup._content.append('انشئ حساب للتصويت')

            routesObjects.push(routeObject)

            routeObject.addEventListener("mouseover", (route)=>{

                /// method 1; make route to display over all then to delete
                /// it or replace it and to set it interactive false to
                /// click over it 

                    // console.log(route.target)
                    routesObjects.forEach(e=>{e.setStyle({color: (e.confirmed?lightGreen:greenColor), opacity: .6})})

                    hoveredRoute?map.removeLayer(hoveredRoute):null
                    hoveredstart?map.removeLayer(hoveredstart):null
                    hoveredend?map.removeLayer(hoveredend):null


                    hoveredRoute = L.polyline(route.target._latlngs, {color:blueColor, opacity: 1,interactive: false}).addTo(map)
                    // console.log(route.target)
                    route.target.start?hoveredstart = L.circle(route.target._latlngs[0],{radius:300 ,color:blueColor, opacity: 1,interactive: false}).addTo(map):null

                    route.target.end?hoveredend = L.circle(route.target._latlngs[route.target._latlngs.length-1], {radius:300, color:blueColor, opacity: 1,interactive: false}).addTo(map):null
            })

            if(e.confirmed){
                confirmedRoutesObjects.push(routeObject)
            }else if(e.start && e.end){
                completedRoutesObjects.push(routeObject)
            }else if(!e.start || !e.end){
                uncompletedRoutesObjects.push(routeObject)
            }
        })
    }

    function ranking(based, order){

    // restructure the accounts array
//label the current account to be green 

let intendedOrder = []
let orderedUserElements
let orderedteamElements

if(based == 'total'){
    if(order == 'de'){
        // decending order 
        intendedOrder = accountsList.sort((a, b) => { return (b.green.length+b.red.length +b.addedRoutes.length + b.votes.length)-(a.green.length +a.red.length+a.addedRoutes.length + a.votes.length)}) 
    }else{
        //acending order 
        intendedOrder = accountsList.sort((a, b) => { return (a.green.length +a.red.length+a.addedRoutes.length + a.votes.length) - (b.green.length+b.red.length +b.addedRoutes.length + b.votes.length)})
    }
}else if(based == 'publicline'){
    if(order == 'de'){
        intendedOrder = accountsList.sort((a,b)=>{return (b.addedRoutes.length + b.votes.length) - (a.addedRoutes.length + a.votes.length)})
    }else{
        intendedOrder = accountsList.sort((a,b)=>{return (a.addedRoutes.length + a.votes.length)- (b.addedRoutes.length + b.votes.length)})
    }

}else if(based == 'bygreen'){
    if(order == 'de'){
        intendedOrder = accountsList.sort((a,b)=>{return (b.red.length + b.green.length) - (a.red.length + a.green.length)})
    }else{
        intendedOrder = accountsList.sort((a,b)=>{return (a.red.length + a.green.length)- (b.red.length + b.green.length)})
    }
}

// make the dom
let currentUserName 
dbUser?currentUserName=dbUser.userName:null

let userCounter= 1
orderedUserElements = `${intendedOrder.map((account, index)=>{
    if(account.type == 'user'){return`
<div class="rankedAccount" ${account.userName == currentUserName?'id="#me" style="background-color: #29D659"':''}>

    <div class="ranking point">${userCounter++}</div>
    <a href=' https://kadum2.github.io/ivc/profile/${account.userName}' class="account">
        <img class="accountImg" style="background-image: url('${account.img}');">
        <h3 class="accountUsername ranked">${account.userName}</h3>
    </a>
        

    <div class='points'>
<div class="publiclineCounter point">${(account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)}</div>
<div class="bygreenCounter point">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</div>
<div class="total point">${((account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)) + ((account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0))}</div>
</div>
    </div>
`}
})}`


    let teamCounter = 1
orderedteamElements = `${intendedOrder.map((account, index)=>{
    if(account.type == 'team'){return`
<div class="rankedAccount" ${account.userName == currentUserName?'style="background-color: #29D659"':''}>
    <div class="ranking point">${teamCounter++}</div>
    <a href=' https://kadum2.github.io/ivc/profile/${account.userName}' class="account">
        <img class="accountImg" style="background-image: url('${account.img}');">
        <h3 class="accountUsername ranked">${account.userName}</h3>
    </a>

    <div class='points'>
<div class="publiclineCounter point">${(account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)}</div>
<div class="bygreenCounter point">${(account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0)}</div>
<div class="total point">${((account.addedRoutes[0]?account.addedRoutes.length:0)+(account.votes[0]?account.votes.length:0)) + ((account.red[0]?account.red.length:0)+(account.green[0]?account.green.length:0))}</div>
</div>
    </div>
`}
    })}`

// console.log('intended order',intendedOrder)
document.querySelector('#usersRanking').innerHTML = orderedUserElements.replaceAll(',', '')
document.querySelector('#teamsRanking').innerHTML = orderedteamElements.replaceAll(',', '')
    }

        //////////// test code; 

    window.onclick = (ev)=>{
            // console.log(ev.target, ev.target.style.zIndex, getComputedStyle(ev.target).zIndex)
            // console.log(routesObjects)
    }


// updateDoc(bygreenDb, collection())

    // getDocs(collection(bygreenDb, 'routes')).then((data)=>{
    //         let docs = []
    //             data.docs.forEach(doc=>{
    //                 docs.push({...doc.data(), id: doc.id})
    //             })
                
    //         docs.forEach(docu=>{
    //             console.log(docu, docu.id)
    //             // updateDoc(doc(bygreenDb, 'routes', docu.id), {name: "اسم المسار"})
                
    //         })
//})




