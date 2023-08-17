import React, { useEffect, useState } from "react";
import '../App.css'
import { useNavigate } from "react-router-dom";
import ReqPopUp from "./requestpopup";
import { CreateAcc, Login }from "./login";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { Alert } from "reactstrap";
import { EditProfilePop } from "./updateuser";

const auth = getAuth();

const SideBar = ({ user, setUser, allUserData, loggedIn, setLoggedIn, authUser, setAuthUser, loading, setLoading }) => {
    const navigate = useNavigate();
    const handleClick = () => navigate('/allpayments');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            setAuthUser(user);
            setLoggedIn(true);
        } else {
            // User is signed out
            setAuthUser({});
            setLoggedIn(false);
        }
    });

    const logout = () => {
        signOut(auth)
        .then(() => {
        // Sign-out successful.
            setLoggedIn(false);
            setUser();
            Alert("You've been logged out.")
        }).catch((error) => {
        // An error happened.
            console.log(error);
        });
        
        window.location.reload()
    };

    // TODO : handle updating email, password, name

    if (!loggedIn) {
        return(
            <div className="sidebar">
                <h1 style={{marginBottom:'10px'}}>Hey, Roomie!</h1>
                <p style={{margin:'0px'}}>You are not logged in. Please Login.</p>
                <div style={{marginTop:'10px', display: 'flex', justifyContent:'center', flexDirection:'column'}}>
                    <CreateAcc user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser}/>
                    <Login user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser}/>
                </div>
                
            </div>
        )
    } 
    
    return (
        <div className="sidebar">
            <div className="user-profile">
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'10px'}}>
                    <h1 style={{marginBottom:'5px'}}> Hey, {auth.currentUser.displayName ? auth.currentUser.displayName.split(" ")[0] : "Roomie"}!</h1>
                    <EditProfilePop location={'sidebar'}/>
                </div>

            </div>
            <div className="nav-buttons">
                <ReqPopUp user={user} allUsersData={allUserData} location={'sidebar'} loading={loading}/>
                <button type='button' onClick={handleClick}>Pay</button>
            </div>
            <div className="check-balances" style={{display: "none"}}>
                <h3>Check Balances</h3>
                <div className="balance-scroll">
                </div>
            </div>
            <button onClick={logout}>Log Out</button>
        </div>
    )

    };

export default SideBar;