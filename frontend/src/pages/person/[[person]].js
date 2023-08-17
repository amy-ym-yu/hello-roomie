import React from "react";
import { useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";


const auth = getAuth()

const Person = ({ use, setUser }) => {
    let location = useLocation();
    var person = location.pathname.toString().slice(1, 2).toUpperCase() + location.pathname.toString().slice(2, );
    
    const [loggedIn, setLoggedIn] = useState(false);
    onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // getUserFromDB(user, setUser);
        setLoggedIn(true);
    } else {
        // User is signed out
        setLoggedIn(false);
    }
    });

    if (!loggedIn) {
        return(
            <div style={{margin:'15px', fontWeight:'normal'}}>
                <h1 style={{fontWeight:'normal'}}>Please login.</h1>
            </div>
        )
    }
    
    return (
    <p>{person}</p>
)}

export default Person;