

// firebase 

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc, arrayUnion, arrayRemove} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

// firebase storage; 
import {getStorage, ref, uploadBytes, getDownloadURL, listAll, list} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-storage.js'
    
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
const publicLinedb = getFirestore(publicLine)
const publicLineAuth = getAuth(publicLine)
const publicLineStorage = getStorage(publicLine)



/////////auth state 
let errDiv = document.querySelector('#errors')

let dbUser ////firestore 
let authUser ///auth 
//////display the right controllers; 
onAuthStateChanged(publicLineAuth, async (user)=>{
    if(user){
        console.log(user, user.uid)
        authUser = user
        user.getIdTokenResult().then(idTokenResult => {console.log(idTokenResult.claims)})
        let userDocRef = doc(publicLinedb, 'users', user.uid)
        let dbUserDoc = await getDoc(userDocRef)
        dbUser = dbUserDoc.data()

        if(dbUser){
            ////registered
            document.querySelectorAll('.logged').forEach(e=>{e.style.display = 'block'})
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>{e.style.display = 'none'})

            ///insert the basic info; 
            document.querySelector('.minicuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".minicuserusername").textContent = dbUser.userName
            document.querySelector('.cuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".cuserusername").textContent = dbUser.userName
            document.querySelector(".cusername").textContent = dbUser.userName
            document.querySelector(".cuserbio").textContent = dbUser.userName

        }else{
            /////half registered
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'block')
            document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')
        }
        
    }else{
        /////not registered
        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')
    }
})

///////register 
document.querySelector('#registerbtn').addEventListener('click', (ev)=>{
    // check if valid data

    // send 
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 0){

        console.log('make account')
        createUserWithEmailAndPassword(publicLineAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
            console.log(cred)
        }).catch(err=>{
            console.log(err.message)
            errDiv.textContent = err.message
            errDiv.style.display = 'block'
            setTimeout(() => {
                errDiv.style.display = 'none'
            }, 10000);
        })
    }else{

    }
    // empty 
    document.querySelector('#registerUsername').value = ''
    document.querySelector('#registerPassword').value = ''
})

//////signin
document.querySelector('#signinbtn').addEventListener('click', (ev)=>{
    console.log('to sign in')
    console.log(ev.target.parentElement)
    // console.log('click signin', document.querySelector('#signinUsername').value.length)
    // console.log(document.querySelector('#signinUsername').value.length >0)

    // send 
    // if(document.querySelector('#signinUsername').value.length > 0 && document.querySelector('#signinPassword').value.length > 0){
        console.log('make account')
        signInWithEmailAndPassword(publicLineAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value)
    // }else{

    // }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})

//////signout 
document.querySelector('#signout').addEventListener('click', ()=>{
    signOut(publicLineAuth, (result)=>{console.log(result)})
})

// sign with google  
const provider = new GoogleAuthProvider()
document.querySelector('#bygoogle').addEventListener('click', ()=>{
    signInWithPopup(publicLineAuth, provider).then((cred)=>console.log(cred))
    
})




//////make profile; 
document.querySelector('#makeprofilebtn').addEventListener('click', async (ev)=>{
    //////////set user in the users collection user current user uid 
    let q = query(collection(publicLinedb, 'users'), where('username', '==', ev.target.parentElement.querySelector('#username').value))
    let foundDoc = await getDocs(q)
    let found

    foundDoc.forEach(e=>{
        found = doc.data()
        console.log(doc.id, doc.data())
    })
    console.log(foundDoc, found)
    if(!found){
        console.log('no taken')

        let fileRef = ref(publicLineStorage, '/userimgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userimg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userimg").files[0]).then(res=>{
                getDownloadURL(res.ref).then(url=>{
                    console.log(url)
                    let imgUrl = url

        ///addDoc; add document to a collection; 
        setDoc(doc(publicLinedb, 'users', authUser.uid), {
            userName: ev.target.parentElement.querySelector('#username').value,
            name: ev.target.parentElement.querySelector('#name').value,
            bio: ev.target.parentElement.querySelector('#bio').value,
            img: imgUrl,
        }).then(()=>{window.location.reload();}) 
        
        })
    })



        // setDoc(doc(publicLinedb, 'users', currentUser.uid), {name: ev.target.querySelector('username').value})
    }else{
        //////////make messaga section to display errors 
        console.log('username already taken')
    }

})

////authstate
document.querySelector(".auth").addEventListener("click", (e)=>{
    e.target.classList.toggle('on')
    if(e.target.classList.contains('on')){
        document.querySelector(".authstate").style.display = 'block'
    }else{
        document.querySelector(".authstate").style.display = 'none'
    }
})







/////ui, js; fb, map, icons, translate, display the footer

/////ui-js-logged; check if logged to display the logged options 
document.querySelector('logged')




////get data; check, deploy 
////deploy data; make, content, insert 

////collect (get) data; 
////send data; check, send, empty 




    ////ui-js 

        const map = L.map('map').setView([33.396600, 44.356579], 9); //leaflet basic map
        L.Control.geocoder().addTo(map);

        let currentUserLocation
        function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log('Geolocation is not supported by this browser')
        }
        }
        function showPosition(position) {
            // map.setView([position.coords.latitude, position.coords.longitude], 16)
            map.flyTo({lat: position.coords.latitude,lng: position.coords.longitude}, 16)
        }
        getLocation()

        ////set icons 
        let oldIcon = L.icon({
            iconUrl: "./imgs/marker-icon.png",
            shadowSize: [50, 64], // size of the shadow
            shadowAnchor: [4, 62], // the same for the shadow
            iconSize: [25, 41],
            iconAnchor: [12, 41],
        });


        ///////display the footer 
        document.querySelector(".mdetails").addEventListener("click", (e)=>{
            e.target.classList.toggle("on")
            if(e.target.classList.contains("on")){
                document.querySelector("footer").style.display = 'block'
            }else{
                document.querySelector("footer").style.display = 'none'
            }
        })














        //////////get data 

        let hoveredRoute 
        let routes 
        let currentRouteId

        window.onload = async () => {
            //////get api key 
            // let rApiKey = await fetch("/map-api-key")
            // let apiKey = await rApiKey.json()
            let apiKey = 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA'
            
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: apiKey
            }).addTo(map);


            ///////getting routes 

            // let routes 
            let routesColl = collection(publicLinedb, 'routes')
            await getDocs(routesColl).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                routes = docs
                console.log(docs)
            }).catch(err=>console.log(err.message))


            console.log("get routes; ", routes)

            document.querySelector("b").textContent = routes.length

            ///deploy them; store
            deployRoutes(routes)
        }


        function deployRoutes(ev){
            Object.values(ev).forEach(async e => { 

                /////content 
                let voteBtns = document.createElement('div')
                let routeName = document.createElement('h3')
                e.name?routeName.textContent = e.name:routeName.textContent = 'اسم الخط' 

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

                    console.log(ev.target)
                    console.log(ev.target.parentElement.parentElement)
                    console.log(currentRouteId)

                    // check what button choosed 
                    if(ev.target.parentElement.parentElement.querySelector('.upvoteBtn').classList.contains('voted')){
                        updateDoc(doc(publicLinedb, 'routes', currentRouteId), {upvotes: arrayUnion(dbUser.userName)}).then(()=>console.log('voted'))
                    }else if(ev.target.parentElement.parentElement.querySelector('.downvoteBtn').classList.contains('voted')){
                        updateDoc(doc(publicLinedb, 'routes', currentRouteId), {downvotes: arrayUnion(dbUser.userName)}).then(()=>console.log('voted'))
                    }

                    upvoteBtn.setAttribute('disabled', true)
                    downvoteBtn.setAttribute('disabled', true)
                    ev.target.setAttribute('disabled', true)
                // ev.target.parentElement.parentElement.querySelector('.upvoteBtn').setAttribute('disabled', true)
                // ev.target.parentElement.parentElement.querySelector('.downvoteBtn').setAttribute('disabled', true)

                })
                sureDiv.append(sureBtn)


                /////insert
                voteBtns.append(routeName, upvoteBtn, downvoteBtn, sureDiv)
                    let routeObject = L.polyline(e.path, {
                    }).bindPopup(voteBtns).addTo(map)

                    // routeObject.name = e.name
                    e.point1?L.circle(e.path._latlngs[0]):null
                    e.point2?L.circle(e.path._latlngs[e.path._latlngs.length-1]):null  
                    
                    routeObject.upvotes = e.upvotes
                    routeObject.downvotes = e.downvotes
                    
                /////content
                    ////////////if logged then allow to vote; 
                    routeObject.addEventListener('click', (ev)=>{
                        console.log('click on route', ev.target)

                        ////////mobile; change color 
                        routesObjects.forEach(e=>{e.setStyle({color: "#3388FF", opacity: .6})})
                        hoveredRoute?map.removeLayer(hoveredRoute):null
                        hoveredRoute = L.polyline(ev.target._latlngs, {interactive: false})
                        hoveredRoute.addTo(map)
                        hoveredRoute.setStyle({color:"#28a84c", opacity: 1})

                        currentRouteId = e.id

                        if(dbUser){
                            if(ev.target.upvotes || ev.target.downvotes){ ///temp
                                console.log('available votes options')
                                if(ev.target.upvotes.includes(dbUser.userName)){
                                    ev.target._popup._content.querySelector('.upvoteBtn').style.border = "2px solid blue"

                                    ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                                    ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                                    // downvoteBtn.setAttribute('disabled', true)
        
                                }else if(ev.target.downvotes.includes(dbUser.userName)){
                                    ev.target._popup._content.querySelector('.downvoteBtn').style.border = "2px solid blue"

                                    ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                                    ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                                }
                            }else{
                                console.log('no upvotes option')
                            }

                        }else{
                            // no account
                                    ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                                    ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                        }

                        e.upvotes?console.log('upvotes', e.upvotes):null
                        e.downvotes?console.log('downvotes', e.downvotes):null
                    })

                routesObjects.push(routeObject)

                routeObject.addEventListener("mouseover", (route)=>{

                    /// method 1; make route to display over all then to delete
                    /// it or replace it and to set it interactive false to
                    /// click over it 

                        // console.log(route.target)
                        routesObjects.forEach(e=>{e.setStyle({color: "#3388FF", opacity: .6})})

                        hoveredRoute?map.removeLayer(hoveredRoute):null
                        hoveredRoute = L.polyline(route.target._latlngs, {interactive: false})
                        hoveredRoute.addTo(map)
                        hoveredRoute.setStyle({color:"#28a84c", opacity: 1})
                        // hoveredRoute.setStyle({color:"red", fillColor: "red"})
                        // routesObjects.push(newRoute)



                    // method 2; change opacity and color 

                    // routesObjects.forEach(e=>{e.setStyle({opacity: 0.7, weight: 3, color: "#3388FF", fillColor: "#3388FF"})})
                    // route.target.setStyle({opacity: 1, weight: 5, color:"#28a84c", fillColor: "#28a84c"})

                })
            })

        }


        /////////////send data 

        /////containers; 
        let routesObjects = [] ///to hover and change color; check more about
        let markers = [] /// list of the labels object
        //path 
        let path = [] ///path points
        let currentPath = [] //path object

        //circles
        let point1 
        let point2 


        ////collect (get) data 

        let addmode = document.querySelector("#addmode")
        addmode.addEventListener("click", (e)=>{
            addmode.classList.toggle("on")
            if(addmode.classList.contains('on')){
            addmode.style.backgroundColor = '#df2727'

            ////delete all routes 
            map.removeLayer(hoveredRoute)
            routesObjects.forEach(ee=>{
                map.removeLayer(ee)
            })
            }else{

                deployRoutes(routes)
                addmode.style.backgroundColor = '#54db7b'
            }
        })

        // make the main route
        map.addEventListener('click', function (ev) {
            if(addmode.classList.contains("on")){

                /////////disable all routes 
                routesObjects.forEach(ee=>{ee.setStyle({opacity:0, interactive: false})})
                console.log(routesObjects)

                ////get data 
                let latlng = map.mouseEventToLatLng(ev.originalEvent);
                console.log(latlng)

                ////make 
                let m = L.marker(latlng, {
                    icon: oldIcon
                }).addTo(map);
                markers.push(m) 


                ////content; no need; current label ??

                /////insert 
                ////js 
                path.push(latlng)
                ////ui 
                currentPath != 0 ? map.removeLayer(currentPath) : null
                currentPath = L.polyline(path).setStyle({color: "red"}).addTo(map)
            }else{
                // routesObjects.forEach(ee=>{ee.setStyle({opacity: 1,interactive: true})})
            }
        });


        /////adding points

        document.querySelector("#point1").addEventListener('click', (e)=>{
            e.target.classList.toggle("on")
            if(e.target.classList.contains('on')){
                // get current making route; 
                console.log(currentPath._latlngs[0])
                point1 = L.circle(currentPath._latlngs[0], {radius: 600, color: 'red'}).addTo(map)
                e.target.style.background = '#ff2a2a'
            }else{
                // point1.removeLayer(map)/
                map.removeLayer(point1)
                e.target.style.background = '#1bf057'
            }
        })

        document.querySelector("#point2").addEventListener('click', (e)=>{

            e.target.classList.toggle("on")
            if(e.target.classList.contains('on')){
                // get current making route; 
                console.log(currentPath._latlngs[currentPath._latlngs.length - 1])
                point2 = L.circle(currentPath._latlngs[currentPath._latlngs.length - 1], {radius: 600, color: 'red'}).addTo(map)
                e.target.style.background = '#ff2a2a'
            }else{
                // point1.removeLayer(map)/
                map.removeLayer(point2)
                e.target.style.background = '#1bf057'
            }

        })


        ////cencel step
        let cancelStep = document.querySelector("#cancel-step")
        cancelStep.addEventListener("click", () => {


            //ui 

            map.removeLayer(markers[markers.length - 1])

            //data 
            markers.pop()

            path.pop()
            // points.pop()
            map.removeLayer(currentPath)
            currentPath = L.polyline(path).addTo(map)

        })
        
        //cancel route
        let cancelRoute = document.querySelector("#cancel-route")
        cancelRoute.addEventListener("click", () => {
            //data 

            path = []
            map.removeLayer(currentPath)
            currentPath = undefined
            console.log(currentPath)

            markers.forEach(e => map.removeLayer(e))
            markers =[]
            console.log(markers)

        })







        ///////////sending 

        document.querySelector("#send").addEventListener("click", () => {

            // if logged send the username with it; 
            // check if data; may make it only available when data set; 
            // make object; 
            let routeToSend = {}
            if(currentPath){ /////available data to send; 
                // routeToSend.path = currentPath._latlngs 
                let validRoute = []
                // let notvalidRoute = []
                // currentPath._latlngs.forEach(e=>validRoute.push(e))
                Object.values(currentPath._latlngs).forEach(e=>validRoute.push({lng: e.lng,lat: e.lat}))
                routeToSend.route = validRoute
                routeToSend.name = document.querySelector("#routeName").value
                point1?routeToSend.point1 = true:routeToSend.point1 = false
                point2?routeToSend.point2 = true:routeToSend.point2 = false
                routeToSend.upvotes = []
                routeToSend.downvotes = []
                // currentUser?routeToSend.insertedBy = currentUser.email:routeToSend.insertedBy = null

                console.log(routeToSend, typeof routeToSend.route, typeof notvalidRoute)

                //////send; 
                let unRoutesColl = collection(publicLinedb, 'unroutes')
                addDoc(unRoutesColl, routeToSend)
            }
    })




        //////////// test code; 

        window.onclick = ()=>{
            // console.log(dbUser)
            console.log(routesObjects)
        }



