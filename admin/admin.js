
// firebase 

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js";

import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.9.2/firebase-auth.js"

import { getFirestore, onSnapshot,
	collection, doc, getDocs, getDoc,
	addDoc, deleteDoc, setDoc,
	query, where, orderBy, serverTimestamp,
	updateDoc } from "https://www.gstatic.com/firebasejs/9.9.2/firebase-firestore.js";

    const bygreenConfig = {
        apiKey: "AIzaSyDqK1z4fd7lO9g2ISbf-NNROMd7xpxcahc",
        authDomain: "bygreen-453c9.firebaseapp.com",
        projectId: "bygreen-453c9",
        storageBucket: "bygreen-453c9.appspot.com",
        messagingSenderId: "19954598250",
        appId: "1:19954598250:web:ba57c792bdf65dbc18a513",
        measurementId: "G-265TN8HGKX"
    }
    
    const bygreen = initializeApp(bygreenConfig, 'bygreen');
    const bygreenDb = getFirestore(bygreen)
    const bygreenAuth = getAuth(bygreen)


    document.querySelector('header').addEventListener('mouseover', (ev)=>{
        
    })

const map = L.map('map').setView([33.396600, 44.356579], 10);
//leaflet basic map
    //////get api key 
    // let rApiKey = await fetch("/map-api-key")
    // let apiKey = await rApiKey.json()

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxmcmVkMjAxNiIsImEiOiJja2RoMHkyd2wwdnZjMnJ0MTJwbnVmeng5In0.E4QbAFjiWLY8k3AFhDtErA'
}).addTo(map);
L.Control.geocoder().addTo(map);



/////////////////authentication 
onAuthStateChanged(bygreenAuth, async (user)=>{
            if(user){
                console.log(user, user.uid)
                user.getIdTokenResult().then(idTokenResult => {
                    console.log(idTokenResult.claims)
                    if(idTokenResult.claims.admin){
                        // auth
                        document.querySelectorAll('.cuserusername').forEach(notlogged=>notlogged.textContent= 'admin')
                        // main
                        document.querySelector('.adminEle').style.display = 'block'
                    }else{
                        // auth
                        document.querySelectorAll('.cuserusername').forEach(notlogged=>notlogged.textContent= user.username)
                        // main
                    }
                })

                ////authstate
                document.querySelectorAll('.logged').forEach(notlogged=>notlogged.style.display = 'block')
                document.querySelectorAll('.notlogged').forEach(notlogged=>notlogged.style.display = 'none')
            }else{
                document.querySelectorAll('.notlogged').forEach(notlogged=>notlogged.style.display = 'block')
                document.querySelectorAll('.logged').forEach(notlogged=>notlogged.style.display = 'none')
            }
})

//////signin
signinbtn.addEventListener('click', (ev)=>{
    // send 
    if(ev.target.parentElement.querySelector('.em').value.length > 0 && ev.target.parentElement.querySelector('.pw').value.length > 0){
        signInWithEmailAndPassword(bygreenAuth, ev.target.parentElement.querySelector(".em").value ,ev.target.parentElement.querySelector(".pw").value).then().catch(err=>{
            console.log(err.message)
            document.querySelector('#errors').textContent = err.message
            document.querySelector('#errors').style.display = 'block'
            setTimeout(() => {
                document.querySelector('#errors').style.display = 'none'
            }, 10000);
        })
    }else{
        document.querySelector('#errors').textContent = 'insert data'
        document.querySelector('#errors').style.display = 'block'
        setTimeout(() => {
            document.querySelector('#errors').style.display = 'none'
        }, 10000);
    }
    // empty 
    ev.target.parentElement.querySelector(".em").value = ''
    ev.target.parentElement.querySelector(".pw").value = ''
})

//////signout 
signoutbtn.addEventListener('click', ()=>{
    signOut(bygreenAuth, (result)=>{console.log('signed out', result)})
})



////////////ui-js 
document.querySelector(".auth").addEventListener("click", (e)=>{
    e.target.classList.toggle('on')
    if(e.target.classList.contains('on')){
        document.querySelector(".authstate").style.display = 'block'
    }else{
        document.querySelector(".authstate").style.display = 'none'
    }
})


    document.querySelector("#unconf").addEventListener("click", ()=>{
        // ev.target.classList.toggle('on')
        document.querySelector('#unconf').classList.add("on")
        document.querySelector('#conf').classList.remove("on")

        document.querySelector("#pathcards").style.display = "block"
        document.querySelector("#conpathcards").style.display = "none"

    })
    document.querySelector("#conf").addEventListener("click", ()=>{
        document.querySelector('#conf').classList.add("on")
        document.querySelector('#unconf').classList.remove("on")

        document.querySelector("#pathcards").style.display = "none"
        document.querySelector("#conpathcards").style.display = "block"

    })
    

//////////ui-js-data

// display confirmed; toggle

// display unconfirmed; toggle


///////////getting data; 
//////data storing;
    function clicking(target, list) {
        //removing from ui 
        let ret = list.filter(e => {
            return e[0] == target || e[1] == target;
        })

        // console.log(ret)
        map.removeLayer(ret[0][0])
        ret[0][1].remove()
        // console.log(ret[0][0]._latlngs)

        return ret[0]
    }

    ///linking list; may no need; change into side prop method
    let linkedRoutes = []
    let linkedLabels = []
    let linkedRoutes2 = []
    let linkedLabels2 = []

    /////data to send; no need
    let confirmed = []
    let deleted = []
    let deletedIds = [] /// ids to delete from confirmed collection; need edit 


    let currentObject


    let conRoutes
    let unRoutes 
    let currentId

        let unconfirmedRoutesList = []
        let deleteList = []
        let confrimList = []



    window.onload = async () => {

        document.querySelector('#sendingDataMessage').textContent = 'getting data'
        document.querySelector('#sendingDataMessage').style.display = 'block'


    //get data; unconfirmed paths, labels 
        // unroutes
        await getDocs(collection(bygreenDb, 'unroutes')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                unRoutes = docs
                console.log('unconfirmed routes' ,unRoutes)
            })
            unRoutes.forEach(uroute=>{
                console.log("the uroute; ", uroute)

                let routeObj = L.polyline(uroute.path).addTo(map)

                if(uroute.point1){
                    routeObj.point1 = L.circle(uroute.path[0], {
                                fillColor: '#3388FF',
                                fillOpacity: 0.8,
                                radius: 10
                            }).addTo(map)    
                        }
                        
                if(uroute.point2){
                    routeObj.point2 = L.circle(uroute.path[uroute.path.length-1], {
                            fillColor: '#3388FF',
                            fillOpacity: 0.8,
                            radius: 10
                            }).addTo(map)    
                    }
                    routeObj.id = uroute.id


                ////document
                let card = document.createElement("div")
                card.classList.add("card")

                let routename = document.createElement('div')
                routename.classList.add('routeName')
                routename.textContent = uroute.name

                let addbtn = document.createElement("button")
                addbtn.classList.add("addbtn")
                addbtn.textContent = "confirm"

                let dltbtn = document.createElement("button")
                dltbtn.classList.add("dltbtn")
                dltbtn.textContent = "delete"

                let btnsDiv = document.createElement('div')
                btnsDiv.append(addbtn, dltbtn)

                card.append(routename, btnsDiv)
                document.querySelector("#pathcards").append(card)

                card.addEventListener('mouseover', (ev)=>{
                    console.log('current hovered card is; ', ev.target)
                    unconfirmedRoutesList.forEach(route=>{
                        route.card.style.background = 'white'
                        route.setStyle({color: '#3C8EFC', opacity: .4})
                    })
                    card.style.background = ' #ff2a2a'
                    unconfirmedRoutesList.filter(route=>route.card == ev.target)[0].setStyle({color: ' #ff2a2a', opacity: 1})

                    map.fitBounds(unconfirmedRoutesList.filter(ee=>{return ee.card == ev.target})[0]._bounds)

                })

                dltbtn.addEventListener('click', (ev)=>{
                    console.log(ev.target.parentElement.parentElement, unconfirmedRoutesList)
                    console.log(unconfirmedRoutesList.filter(route=>route.card==ev.target.parentElement.parentElement)[0])
                    
                    deleteList.push(unconfirmedRoutesList.filter(route=>route.card==ev.target.parentElement.parentElement)[0].id)

                    document.querySelector('#pathcards').removeChild(ev.target.parentElement.parentElement)
                    map.removeLayer(unconfirmedRoutesList.filter(route=>route.card == ev.target.parentElement.parentElement)[0])
                    // no need to remove it from list?
                    unconfirmedRoutesList
                    
                })
                addbtn.addEventListener('click', (ev)=>{
                    console.log(ev.target.parentElement)
                    console.log(unconfirmedRoutesList.filter(route=>route.card==ev.target.parentElement.parentElement)[0].id)
                    
                    confrimList.push(unconfirmedRoutesList.filter(route=>route.card==ev.target.parentElement.parentElement)[0].id)

                    document.querySelector('#pathcards').removeChild(ev.target.parentElement.parentElement)
                    map.removeLayer(unconfirmedRoutesList.filter(route=>route.card == ev.target.parentElement.parentElement)[0])

                })



                routeObj.addEventListener('mouseover', (ev)=>{
                    unconfirmedRoutesList.forEach(route=>{
                        route.card.style.background = 'white'
                        route.setStyle({color: '#3C8EFC', opacity: .4})
                    })
                    ev.target.card.style.background = ' #ff2a2a'
                    ev.target.setStyle({color: ' #ff2a2a', opacity: 1})
                })
                routeObj.addEventListener('click', (ev)=>{
                    console.log('current object id; ', ev.target.id)
                    currentId = ev.target.id

                    document.querySelector('#sendingDataMessage').textContent = 'select route'
                    document.querySelector('#sendingDataMessage').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('#sendingDataMessage').style.display = 'none'
                        
                    }, 1000);
                })
        // link the objects 
        routeObj.card = card
        // the looped list
        unconfirmedRoutesList.push(routeObj)
            })


            // confirmed routes
                    // routes
        await getDocs(collection(bygreenDb, 'routes')).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                conRoutes = docs
                console.log('unconfirmed routes' ,unRoutes)
                document.querySelector('#sendingDataMessage').style.display = 'none'
            })

        let confirmedRoutesList = []
            conRoutes.forEach(uroute=>{
                console.log("the uroute; ", uroute)

                let routeObj = L.polyline(uroute.path, {color: `#29D659`}).addTo(map)

                if(uroute.point1){
                    routeObj.point1 = L.circle(uroute.path[0], {
                                fillColor: '#29D659',
                                color: '#29D659',
                                fillOpacity: 0.8,
                                radius: 10
                            }).addTo(map)    
                        }
                        
                if(uroute.point2){
                    routeObj.point2 = L.circle(uroute.path[uroute.path.length-1], {
                            fillColor: '#29D659',
                            color: '#29D659',
                            fillOpacity: 0.8,
                            radius: 10
                            }).addTo(map)    
                    }
                    routeObj.id = uroute.id


                ////document
                let card = document.createElement("div")
                card.classList.add("card")

                let routename = document.createElement('div')
                routename.classList.add('routeName')
                routename.textContent = uroute.name

                let dltbtn = document.createElement("button")
                dltbtn.classList.add("dltbtn")
                dltbtn.textContent = "delete"

                let btnsDiv = document.createElement('div')
                btnsDiv.append(dltbtn)

                card.append(routename, btnsDiv)
                document.querySelector("#conpathcards").append(card)

                card.addEventListener('mouseover', (ev)=>{
                    console.log('current hovered card is; ', ev.target)
                    confirmedRoutesList.forEach(route=>{
                        route.card.style.background = 'white'
                        route.setStyle({color: 'rgba(41, 214, 90, 0.801)', opacity: .4})
                    })
                    card.style.background = '#21883e'
                    confirmedRoutesList.filter(route=>route.card == ev.target)[0].setStyle({color: '#21883e', opacity: 1})

                    // let filteredconRoute = 
                    // console.log(filteredconRoute)
                    map.fitBounds(confirmedRoutesList.filter(ee=>{return ee.card == ev.target})[0]._bounds)

                })

                dltbtn.addEventListener('click', (ev)=>{
                    console.log(ev.target.parentElement)
                    console.log(confirmedRoutesList.filter(route=>route.card==ev.target.parentElement.parentElement)[0].id)
                    
                    deleteList.push(confirmedRoutesList.filter(route=>route.card==ev.target.parentElement.parentElement)[0].id)

                    
                    document.querySelector('#conpathcards').removeChild(ev.target.parentElement.parentElement)
                    map.removeLayer(confirmedRoutesList.filter(route=>route.card == ev.target.parentElement.parentElement)[0])


                    
                })

                routeObj.addEventListener('mouseover', (ev)=>{
                    confirmedRoutesList.forEach(route=>{
                        route.card.style.background = 'white'
                        route.setStyle({color: 'rgba(41, 214, 90, 0.801)', opacity: .4})
                    })
                    ev.target.card.style.background = '#21883e'
                    ev.target.setStyle({color: '#21883e', opacity: 1})
                })

                routeObj.addEventListener('click', (ev)=>{
                    console.log('current object id; ', ev.target.id)
                    currentId = ev.target.id

                    document.querySelector('#sendingDataMessage').textContent = 'select route'
                    document.querySelector('#sendingDataMessage').style.display = 'block'
                    setTimeout(() => {
                        document.querySelector('#sendingDataMessage').style.display = 'none'
                        
                    }, 1000);
                })
        // link the objects 
        routeObj.card = card
        // the looped list
        confirmedRoutesList.push(routeObj)
            })

    }




    ///////////////////////sending data 

    //////collect data; 

    document.querySelector("#deleteCurrent").addEventListener("click", (e) => {
        console.log(currentId)
        
        deleteDoc(doc(bygreenDb, 'routes', currentId)).then(()=>console.log("deleted"))
        deleteDoc(doc(bygreenDb, 'unroutes', currentId)).then(()=>console.log("deleted"))




    })



    let send = document.querySelector("#send")
    send.addEventListener("click", async () => {
        console.log("confirmed",confrimList, "deleted", deleteList, "deletedIDs")


        confrimList.forEach(confirmed=>{
            let routeToAdd = unRoutes.filter(route=>route.id==confirmed)[0]
            document.querySelector('#sendingDataMessage').textContent = 'sending data'
            document.querySelector('#sendingDataMessage').style.display = 'block'

            // add 
            addDoc(collection(bygreenDb, 'routes'), routeToAdd).then(()=>{
            // delete
            deleteDoc(doc(bygreenDb, 'unroutes', confirmed)).then(()=>console.log('deleted'))
            document.querySelector('#sendingDataMessage').textContent = 'sent'

                setTimeout(() => {
                    document.querySelector('#sendingDataMessage').style.display = 'none'
                }, 1000);

            })
        })

        deleteList.forEach(toDelete=>{
            deleteDoc(doc(bygreenDb, 'routes', toDelete)).then(()=>console.log("deleted")).catch(()=>{})
            deleteDoc(doc(bygreenDb, 'unroutes', toDelete)).then(()=>console.log("deleted")).catch(()=>{})

        })

    })


    /////test code;
    window.onclick = () => {
        // console.log("confirmed routes", confirmed)
    }

