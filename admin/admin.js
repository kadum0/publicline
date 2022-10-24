
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
        measurementId: "G-265TN8HGKX"};
    
    const bygreen = initializeApp(bygreenConfig, 'bygreen');
    const bygreenDb = getFirestore(bygreen)
    const bygreenAuth = getAuth(bygreen)


////////////ui-js 

    //leaflet basic map
    const map = L.map('map').setView([33.396600, 44.356579], 10);

    document.querySelector("#unconf").addEventListener("click", ()=>{
        document.querySelector("#pathcards").style.display = "none"

        document.querySelector("#conpathcards").style.display = "block"
    })
    document.querySelector("#conf").addEventListener("click", ()=>{
        document.querySelector("#pathcards").style.display = "block"

        document.querySelector("#conpathcards").style.display = "none"
    })
    

    

        /////////////////authentication 

        onAuthStateChanged(bygreenAuth, async (user)=>{
            if(user){
                console.log(user, user.uid)
                user.getIdTokenResult().then(idTokenResult => {console.log(idTokenResult.claims)})
        
                // display logged controllers; 
                /////logout options 

                ////logged available options 
                document.querySelector('.logged').style.display = 'block'
            }else{
                // display login and register
                console.log('to display not logged and login ')
                // document.querySelector(".notlogged").style.display = 'block'
                document.querySelector("#login").style.display = 'block'
            }
        })
        
        //////signin
        document.querySelector('#signinBtn').addEventListener('click', async ()=>{
            // send 
            if(document.querySelector('#em').value.length > 0 && document.querySelector('#pw').value.length > 0){
                console.log('make account')
                signInWithEmailAndPassword(bygreenAuth, document.querySelector('#em').value, document.querySelector('#pw').value)
            }else{
                console.log('the else of signin')
            }
            // empty 
            document.querySelector('#signinUsername').value = ''
            document.querySelector('#signinPassword').value = ''
        })
        
        //////signout 
        document.querySelector('#diSignout').addEventListener('click', ()=>{
            signOut(auth, (result)=>{console.log(result)})
        })
    






///////////get data 



    //////data storing;

    ///linking list; may no need
    let linkedRoutes = []
    let linkedLabels = []
    let linkedRoutes2 = []
    let linkedLabels2 = []


    /////data to send 
    let confirmed = []
    let deleted = []
    let deletedIds = [] /// ids to delete from confirmed collection; need edit 

    let currentObject

    /////delete current object; ????
    let deleteCurrent = document.querySelector("#deleteCurrent")
    deleteCurrent.addEventListener("click", (e) => {
        console.log(linkedLabels)

        if (linkedLabels.filter(i => {
                i[0] == currentObject;
                return i
            }) || linkedRoutes.filter(i => {
                i[0] == currentObject;
                return i
            })) {
            let ret = clicking(currentObject, linkedLabels)
            deleted.push(ret[0]._latlng)
        } else if (linkedLabels2.filter(i => {
                i[0] == currentObject;
                return i
            }) || linkedRoutes2.filter(i => {
                i[0] == currentObject;
                return i
            })) {
            let ret = clicking(currentObject, linkedLabels)
            deletedIds.push(ret[2])
        }
    })


    let currentRoute 

    document.querySelector('#addpoint1').addEventListener("click", ()=>{

    })



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

L.Control.geocoder().addTo(map);



    //get data; unconfirmed paths, labels 
        let unConCardsList = []
        let unConRouteList = []
        let unRoutes 
        let unRoutesColl = collection(bygreenDb, 'unroutes')

        await getDocs(unRoutesColl ).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                unRoutes = docs
                console.log(unRoutes)
            }).catch(err=>console.log('err message', err.message))
            

        unRoutes.forEach(e => {

                console.log("will create routes", e.route)

                ////create the object 
                // let theObject ////???
                let unConRoute = L.polyline(e.route).addTo(map)

                if(e.point1){
                    L.circle(e.route[0], {
                            fillColor: '#3388FF',
                            fillOpacity: 0.8,
                            radius: 10
                        }).addTo(map)    
                }
                if(e.point2){
                    L.circle(e.route[e.route.length-1], {
                        fillColor: '#3388FF',
                        fillOpacity: 0.8,
                        radius: 10
                    }).addTo(map)    
                }
                unConRouteList.push(unConRoute)


                //create card

                // /////template; 
                // let cardtemp = `
                // <div class="card">
                //     <button class="addbtn">confirm</button>
                //     <button class="dltbtn">delete</button>
                // </div>
                // `
                // document.querySelector("#pathCards").innerHTML += cardtemp

                ////document
                let card = document.createElement("div")

                card.classList.add("card")
                let addbtn = document.createElement("button")
                addbtn.classList.add("addbtn")
                addbtn.textContent = "confirm"
                let dlbtn = document.createElement("button")
                dlbtn.classList.add("dltbtn")
                dlbtn.textContent = "delete"
                card.append(addbtn, dlbtn)
                document.querySelector("#pathcards").append(card)
                unConCardsList.push(card)


                ////insert in the element directly 

                unConRoute.card = card

                // conRoute.addEventListener("click", (e)=>console.log(e.target))
                unConRoute.addEventListener('mouseover', (e)=>{
                    console.log(e.target)
                    unConCardsList.forEach(ee=>ee.style.background = 'white')
                    unConRouteList.forEach(ee=>ee.setStyle({color: '#3C8EFC', opacity: .4}))

                    e.target.card.style.background = 'rgb(255, 43, 43)'
                    e.target.setStyle({color: 'rgb(255, 43, 43)', opacity: 1})
                })
                card.addEventListener("mouseover", (e)=>{
                    unConCardsList.forEach(ee=>ee.style.background = 'white')
                    unConRouteList.forEach(ee=>ee.setStyle({color: '#3C8EFC', opacity: .4}))

                    let filteredunConRoute = unConRouteList.filter(ee=>{return ee.card == e.target})
                    // console.log(filteredunConRoute)
                    map.fitBounds(filteredunConRoute[0]._bounds)
                    
                    filteredunConRoute[0].setStyle({color: 'rgb(255, 43, 43)', opacity: 1})
                    e.target.style.background = 'rgb(255, 43, 43)'
                    // console.log(ununConRouteList.filter(e=>{return e.card == e.target}))
                    
                })
            })









        ////getting confirmed
        let conCardsList = []
        let conRouteList = []

        let routes 
        let routesColl = collection(bygreenDb, 'routes')

        await getDocs(routesColl ).then((data)=>{
            let docs = []
                data.docs.forEach(doc=>{
                    docs.push({...doc.data(), id: doc.id})
                })
                routes = docs
                console.log(routes)
            }).catch(err=>console.log('err message', err.message))
            


        console.log("get confirmed", routes)

        Object.values(routes).forEach(e => {


                console.log("will create routes", e)
                
                //create the object 
                // let theObject
                let conRoute = L.polyline(e.path).setStyle({color: "#106328"}).addTo(map)
                    if(e.point1){
                        L.circle(e.path[e.path[0]], {
                            color: "#106328",
                            fillColor: '#106328',
                            fillOpacity: 0.8,
                            // radius: 10
                            radius: 4
                        }).addTo(map)
                    }

                    if(e.point2){
                        L.circle(e.route[e.route.length-1], {
                            color: "#106328",
                            fillColor: '#106328',
                            fillOpacity: 0.8,
                            // radius: 10
                            radius: 4
                        }).addTo(map)
                    }
                    
                    conRouteList.push(conRoute)

                    conRoute.addEventListener("click", (ev)=>{
                        console.log(ev.target)
                        selectedRoute 
                    })

                //create card
                let card = document.createElement("div")
                card.classList.add("card")
                let dlbtn = document.createElement("button")
                dlbtn.classList.add("dltbtn")
                dlbtn.textContent = "delete"
                card.append(dlbtn)
                document.querySelector("#conpathcards").append(card)

                conCardsList.push(card)


                conRoute.card = card

                // conRoute.addEventListener("click", (e)=>console.log(e.target))
                conRoute.addEventListener('mouseover', (e)=>{
                    conCardsList.forEach(ee=>ee.style.background = 'white')
                    conRouteList.forEach(ee=>ee.setStyle({color: '#29D659', opacity: .4}))

                    e.target.card.style.background = 'rgb(255, 43, 43)'
                    e.target.setStyle({color: 'rgb(255, 43, 43)', opacity: 1})
                })
                card.addEventListener("mouseover", (e=>{
                    conCardsList.forEach(ee=>ee.style.background = 'white')
                    conRouteList.forEach(ee=>ee.setStyle({color: '#29D659', opacity: .4}))

                    let filteredconRoute = conRouteList.filter(ee=>{return ee.card == e.target})
                    // console.log(filteredconRoute)
                    map.fitBounds(filteredconRoute[0]._bounds)
                    
                    filteredconRoute[0].setStyle({color: 'rgb(255, 43, 43)', opacity: 1})
                    e.target.style.background = 'rgb(255, 43, 43)'
                    // console.log(unConRouteList.filter(e=>{return e.card == e.target}))
                    
                }))
        })
    }


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



    ///////////////////////sending data 


    //////get data to send editing; 


    let send = document.querySelector("#send")
    send.addEventListener("click", async () => {

        console.log("confirmed",!confirmed[0], "deleted", !deleted[0], "deletedIDs", !deletedIds[0])





        // //// confirmed labels; 
        // if(confirmed[0]){
        //     console.log("will send confiremd; ",confirmed)

        //     await fetch("/confirmed", {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(confirmed)
        //     })
        //     confirmed = []
        // }else{
        //     console.log("will not send confirmed; ", Boolean(confirmed[0]))
        // }

        // //////deleted 
        // if(deleted[0]){
        //     await fetch("/deleted", {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(deleted)
        //     })
        //     deleted = []
        // }else{
        //     console.log("will not send deleted; ", Boolean(deleted[0]))
        // }

        // ////deleted ids 
        // if(deletedIds[0]){
        //     await fetch("/editconfirmed", {
        //         method: "POST",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(deletedIds)
        //     })
        //     deletedIds = []
        // }else{
        //     console.log("will not send deletedID; ", Boolean(deletedIds[0]))
        // }
    })

    document.querySelector("#sendspecial").addEventListener('click', ()=>{
        ////
    })



    /////test code; 

    window.onclick = () => {
        console.log("confirmed routes", confirmed)
        console.log("deleted routes", deleted)
        // console.log("confirmed labels", confirmedLabels)
    }

