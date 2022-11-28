

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
    

const bygreenConfig = {
    apiKey: "AIzaSyDqK1z4fd7lO9g2ISbf-NNROMd7xpxcahc",
    authDomain: "bygreen-453c9.firebaseapp.com",
    projectId: "bygreen-453c9",
    storageBucket: "bygreen-453c9.appspot.com",
    messagingSenderId: "19954598250",
    appId: "1:19954598250:web:ba57c792bdf65dbc18a513",
    measurementId: "G-265TN8HGKX"};

const bygreen = initializeApp(bygreenConfig, 'bygreen');
const bygreenDb = getFirestore(bygreen)
const bygreenAuth = getAuth(bygreen)
const bygreenStorage = getStorage(bygreen)

/////////auth state 
let errDiv = document.querySelector('#errors')

let dbUser ////firestore 
let authUser ///auth 
let type
let accountsList = []

let redPinIcon = L.icon({
    iconUrl: "./imgs/redpin.png",
    shadowSize: [50, 64], // size of the shadow
    shadowAnchor: [4, 62], // the same for the shadow
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -30] 
});


// getting ???
await onAuthStateChanged(bygreenAuth, async (user)=>{
    console.log('authstatefun', dbUser)
    if(user){
        console.log('from auth ', user)
        authUser = user
        user.getIdTokenResult().then(idTokenResult => {
            console.log('claims', idTokenResult.claims)
            type = idTokenResult.claims
            // if team 
            if (idTokenResult.claims.team){
                document.querySelectorAll('.teamEle').forEach(teamEle=>{
                    teamEle.style.display = 'inline-block'
                })
                // document.querySelector('.addYellow').style.display = 'block'
            }
        })
        let dbUserDoc = await getDoc(doc(bygreenDb, 'users', user.uid))
        dbUser = dbUserDoc.data()

        if(dbUser){
        dbUser.id = dbUserDoc.id

            ////registered
            document.querySelectorAll('.logged').forEach(e=>{e.style.display = 'block'})
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')

            ///insert the basic info; 
            document.querySelector('.minicuserimg').style.backgroundImage = `url('${dbUser.img}')`
            // document.querySelector(".minicuserusername").textContent = '@'+ dbUser.userName
            document.querySelector('.cuserimg').style.backgroundImage = `url('${dbUser.img}')`
            document.querySelector(".cuserusername").textContent = '@'+ dbUser.userName
            document.querySelector(".cusername").textContent = dbUser.name
            document.querySelector(".cuserbio").textContent = dbUser.bio
            document.querySelector("#profileLink").href = window.location.host+'/'+ dbUser.userName

            document.querySelector(".addedRoutes").querySelector('span').textContent = dbUser.addedRoutes.length
            document.querySelector(".votes").querySelector('span').textContent += dbUser.votes.length


        }else{
            /////half registered; make profile
            document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'block')
            document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
            document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'none')
        }
        
    }else{
        /////not registered
        document.querySelectorAll('.notlogged').forEach(e=>e.style.display = 'block')
        document.querySelectorAll('.logged').forEach(e=>e.style.display = 'none')
        document.querySelectorAll('.makeprofile').forEach(e=>e.style.display = 'none')

        dbUser = 'none'
    }

    getDocs(collection(bygreenDb, 'users')).then((data)=>{
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
})
///////register 
document.querySelector('#registerbtn').addEventListener('click', (ev)=>{
    // check if valid data

    // send 
    if(ev.target.parentElement.querySelector(".em").value.length > 0 &&ev.target.parentElement.querySelector(".em").value.length < 20 && ev.target.parentElement.querySelector(".pw").value.length > 0){

        console.log('make account')
        createUserWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value, ev.target.parentElement.querySelector(".pw").value).then(cred=>{
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
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value)
    // }else{

    // }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})

//////signout 
document.querySelector('#signoutbtn').addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log(result)})
})

// sign with google  
const provider = new GoogleAuthProvider()
document.querySelector('#bygoogle').addEventListener('click', ()=>{
    signInWithPopup(bygreenAuth, provider).then((cred)=>console.log(cred))

})


//////make profile; 
document.querySelector('#makeprofilebtn').addEventListener('click', async (ev)=>{
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

        let fileRef = ref(bygreenStorage, '/userimgs/' + new Date().toISOString().replace(/:/g, '-') +document.querySelector("#userimg").files[0].name.replaceAll(" ","") )

            uploadBytes(fileRef, document.querySelector("#userimg").files[0]).then(res=>{
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

////authstate
document.querySelector(".auth").addEventListener("click", (e)=>{
    e.target.classList.toggle('on')
    if(e.target.classList.contains('on')){
        document.querySelector(".authstate").style.display = 'block'
    }else{
        document.querySelector(".authstate").style.display = 'none'
    }
})



    ////ui-js 

        const map = L.map('map', { zoomControl: false }).setView([33.396600, 44.356579], 9); //leaflet basic map
        L.Control.geocoder().addTo(map);

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
        document.querySelector("#footer-di").addEventListener("click", (e)=>{
            e.target.classList.toggle("on")
            if(e.target.classList.contains("on")){
                document.querySelector("footer").style.display = 'block'
            }else{
                document.querySelector("footer").style.display = 'none'
            }
        })





    ////// ui-js-data
    // ranking options
        function ranking(based, order){

            // restructure the accounts array
        //label the current account to be green 
    
        let intendedOrder = []
        let orderedUserElements
        let orderedteamElements
    
        if(based == 'total'){
            if(order == 'de'){
                // decending order 
                intendedOrder = accountsList.sort((a, b) => { return (b.votes.length+b.addedRoutes.length)-(a.votes.length +a.addedRoutes.length)}) 
            }else{
                //acending order 
                intendedOrder = accountsList.sort((a, b) => { return (a.votes.length +a.addedRoutes.length)-(b.votes.length+b.addedRoutes.length)})
            }
        }else if(based == 'addedRoutes'){
            if(order == 'de'){
                intendedOrder = accountsList.sort((a,b)=>{return b.addedRoutes.length - a.addedRoutes.length})
            }else{
                intendedOrder = accountsList.sort((a,b)=>{return a.addedRoutes.length - b.addedRoutes.length})
            }
    
        }else if(based == 'votes'){
            if(order == 'de'){
                intendedOrder = accountsList.sort((a,b)=>{return b.votes.length - a.votes.length})
            }else{
                intendedOrder = accountsList.sort((a,b)=>{return a.votes.length - b.votes.length})
            }
    
        }
        // make the dom
        let currentUserName 
        dbUser?currentUserName=dbUser.userName:null
    
        let userCounter= 1
        orderedUserElements = `${intendedOrder.map((account, index)=>{
            if(account.type == 'user'){return`
    <div class="rankedAccount" ${account.userName == currentUserName?'id="#me" style="background-color: #29D659"':''}>
        <span class="ranking">${userCounter++}</span>
            <a href=' http://${window.location.host+'/profile/'+ account.userName} '> <b style='color: white'> 
        <div class="account">
            <img class="accountImg" style="background-image: url('${account.img}');">
            <h3 class="accountUsername ranked">${account.userName}</h3>
        </div>
            
            </b> </a>
    
    
        <h3 class="addedRoutes">${account.addedRoutes.length}</h3>
        <h3 class="votes">${account.votes.length}</h3>
        <h3 class="total">${account.addedRoutes.length+account.votes.length}</h3>
    </div>
        `}
    })}`
    
    
            let teamCounter = 1
        orderedteamElements = `${intendedOrder.map((account, index)=>{
            if(account.type == 'team'){return`
    <div class="rankedAccount" ${account.userName == currentUserName?'style="background-color: #29D659"':''}>
        <span class="ranking">${teamCounter++}</span>
        <div class="account">
            <img class="accountImg" style="background-image: url('${account.img}');">
            <h3 class="accountUsername ranked">${account.userName}</h3>
        </div>
    
        <h3 class="addedRoutes">${account.addedRoutes.length}</h3>
        <h3 class="votes">${account.votes.length}</h3>
        <h3 class="total">${account.addedRoutes.length+account.votes.length}</h3>
    </div>
        `}
            })}`
    
        console.log('intended order',intendedOrder)
        document.querySelector('#usersRanking').innerHTML = orderedUserElements.replaceAll(',', '')
        document.querySelector('#teamsRanking').innerHTML = orderedteamElements.replaceAll(',', '')
    }
    
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












        //////////get data 

        let hoveredRoute 
        let hoveredPoint1
        let hoveredPoint2

        let routes 
        let currentRouteId

        window.onload = async () => {

            if(window.location.href.includes('location')){
                console.log('contains temp pin', window.location.href.split('/'))

                // make the pin
                let currentPin = L.marker({
            lat: window.location.href.split('/')[window.location.href.split('/').length-2].split(',')[0],
            lng: window.location.href.split('/')[window.location.href.split('/').length-2].split(',')[1]
            }, {icon: redPinIcon}).addTo(map)

                // flyto it 
                console.log(currentPin)
                map.flyTo(currentPin._latlng, 16)

            }

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
            await getDocs(collection(bygreenDb, 'routes')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                routes = docs
                console.log(docs)

                document.querySelector('#addedRoutesCounter').textContent = routes.length

                document.querySelector('#sendingDataMessage').style.display = 'none'
            }).catch(err=>console.log(err.message))


            console.log("get routes; ", routes)

            // document.querySelector("b").textContent = routes.length

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


                /////insert
                voteBtns.append(routeName, upvoteBtn, downvoteBtn, sureDiv)
                    let routeObject = L.polyline(e.path).bindPopup(voteBtns).addTo(map)

                    // routeObject.name = e.name
                    e.point1?L.circle(e.path[0],{radius: 300}).addTo(map):null
                    e.point2?L.circle(e.path[e.path.length-1],{radius: 300}).addTo(map):null 
                    
                    routeObject.upvotes = e.upvotes
                    routeObject.downvotes = e.downvotes
                    routeObject.id = e.id
                    routeObject.point1 = e.point1
                    routeObject.point2 = e.point2
                    
                /////content
                    ////////////if logged then allow to vote; 
                    routeObject.addEventListener('click', (ev)=>{
                        console.log('click on route', ev.target)

                        currentRouteId = e.id

                        ////////mobile; change color 
                        routesObjects.forEach(e=>{e.setStyle({color: "#3388FF", opacity: .6})})
                        hoveredRoute?map.removeLayer(hoveredRoute):null
                        hoveredRoute = L.polyline(ev.target._latlngs, {interactive: false})
                        hoveredRoute.addTo(map)
                        hoveredRoute.setStyle({color:"#28a84c", opacity: 1})


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
                                // display; have to login to vote 

                            ev.target._popup._content.querySelector('.upvoteBtn').setAttribute('disabled', true)
                                    ev.target._popup._content.querySelector('.downvoteBtn').setAttribute('disabled', true)
                                    ev.target._popup._content.append('انشئ حساب للتصويت')
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
                        hoveredPoint1?map.removeLayer(hoveredPoint1):null
                        hoveredPoint2?map.removeLayer(hoveredPoint2):null


                        hoveredRoute = L.polyline(route.target._latlngs, {color:"#28a84c", opacity: 1,interactive: false}).addTo(map)
                        // console.log(route.target)
                        route.target.point1?hoveredPoint1 = L.circle(route.target._latlngs[0],{radius:300 ,color:"#28a84c", opacity: 1,interactive: false}).addTo(map):null

                        route.target.point2?hoveredPoint2 = L.circle(route.target._latlngs[route.target._latlngs.length-1], {radius:300, color:"#28a84c", opacity: 1,interactive: false}).addTo(map):null
                        // hoveredRoute.addTo(map)
                        // hoveredRoute.setStyle({color:"#28a84c", opacity: 1})
                        // hoveredRoute.setStyle({color:"red", fillColor: "red"})
                        // routesObjects.push(newRoute)



                    // method 2; change opacity and color 

                    // routesObjects.forEach(e=>{e.setStyle({opacity: 0.7, weight: 3, color: "#3388FF", fillColor: "#3388FF"})})
                    // route.target.setStyle({opacity: 1, weight: 5, color:"#28a84c", fillColor: "#28a84c"})
                })
            })
        }


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

        let tempMarker 

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

                // add direct pin and link to share
                tempMarker?map.removeLayer(tempMarker):console.log('not removed')
                console.log(map.mouseEventToLatLng(ev.originalEvent))

                tempMarker = L.marker(map.mouseEventToLatLng(ev.originalEvent)).bindPopup(`link; <br><a href='${window.location.href+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng}'>${window.location.hostname+'/location/'+map.mouseEventToLatLng(ev.originalEvent).lat+','+map.mouseEventToLatLng(ev.originalEvent).lng}</a>
                `).addTo(map)
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
            if(currentPath[0] || document.querySelector('#routeName').value){ /////available data to send; 
                // routeToSend.path = currentPath._latlngs 
                document.querySelector('#sendingDataMessage').textContent = 'sending'
                document.querySelector('#sendingDataMessage').style.display = 'block'
                
                console.log(currentPath)
                let validRoute = []
                // let notvalidRoute = []
                // currentPath._latlngs.forEach(e=>validRoute.push(e))
                Object.values(currentPath._latlngs).forEach(e=>validRoute.push({lng: e.lng,lat: e.lat}))
                routeToSend.path = validRoute
                routeToSend.name = document.querySelector("#routeName").value
                point1?routeToSend.point1 = true:routeToSend.point1 = false
                point2?routeToSend.point2 = true:routeToSend.point2 = false
                routeToSend.upvotes = []
                routeToSend.downvotes = []
                // currentUser?routeToSend.insertedBy = currentUser.email:routeToSend.insertedBy = null

                console.log(routeToSend, typeof routeToSend.route, typeof notvalidRoute)

                //////send; 
                addDoc(collection(bygreenDb, 'unroutes'), routeToSend).then(e=>{
                    document.querySelector('#sendingDataMessage').textContent = 'sent'
                    location.reload()

                    setTimeout(() => {
                        document.querySelector('#sendingDataMessage').style.display = 'none'
                    }, 1000);

                })
            }else{
                console.log('set the rest data')
                document.querySelector("#errorMessage").textContent = 'اكمل ملئ البيانات و اضافة مسار كامل'
                document.querySelector("#errorMessage").style.display='block'

                setTimeout(() => {
                    document.querySelector("#errorMessage").textContent = ''
                    document.querySelector("#errorMessage").style.display='none'
                }, 2000);
            }
    })




        //////////// test code; 

        window.onclick = ()=>{
            console.log(currentPath)
            // console.log(routesObjects)
        }



