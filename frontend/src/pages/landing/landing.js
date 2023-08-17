import React, { useState, useEffect } from "react";
import '../pages.css';
import TransactionCard from "../../components/transaction";
import { db } from '../../firebase';
import { collection, getDocs, getDoc, doc, query, orderBy, limit } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();

const Landing = ({ allUserData, loggedIn, setLoggedIn, authUser, setAuthUser, loading, setLoading }) => {
    const [allUserActivity, setAllUserActivity] = useState([]);

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

    async function getAllTransactions() {
        setLoading(true);
        // gather each doc => tempDoc array
        const tempDoc = [];

        const transRef = collection(db, "transactions");
        const q = query(transRef, orderBy("date", "desc"), limit(15));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tempDoc.push({ ...doc.data() })
        });
        console.log("getAllTransactions:", tempDoc);
        // set allUserData
        setAllUserActivity(tempDoc);
        setLoading(false);
    }

    useEffect(() => {
        // Loads on first render
        getAllTransactions();

        // Loads every 30 minutes 
        const timer = setTimeout(() => {
            getAllTransactions();
          }, 1800000); // (time in milliseconds)
          return () => clearTimeout(timer);
    }, []);

    

    if (!loggedIn) {
        return(
            <div style={{margin:'15px', fontWeight:'normal'}}>
                <h1 style={{fontWeight:'normal'}}>Please login.</h1>
            </div>
        )
    }

    if (loading) {
        return(
            <div style={{margin:'15px', fontWeight:'normal'}}>
                <h1 style={{fontWeight:'normal'}}>Loading...</h1>
            </div>
        )
    }
    
    return (
        <div className="landing">
             <p style={{textAlign: 'left', padding: '10px 20px 0px 20px ', fontSize:'36px', margin: '0'}}>recent activity</p>
             <hr style={{width:'90%'}}/>
            {allUserActivity.map((item) => <TransactionCard transaction={item} user={auth.currentUser} location={'landing'} loggedIn={loggedIn} allUserData={allUserData} loading={loading} setLoading={setLoading}/>)}
        </div>
)}

export default Landing;