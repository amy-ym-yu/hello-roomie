import React, { PureComponent } from "react";
import '../pages.css';
import TransactionCard from "../../components/transaction";
import ReqPopUp from "../../components/requestpopup";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { getDocs, doc, collection, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";


const auth = getAuth();

const AllPayments = ({allUserData, loggedIn, setLoggedIn, authUser, setAuthUser }) => {
    // USER
    const user = auth.currentUser;
    var firstName = '';
    var lastName = '';
    var email = '';
    var uid = '';

    if (user !== null) {
        const displayName = user.displayName;
        firstName = displayName.split(" ")[0];
        lastName = displayName.split(" ")[1];
        email = user.email;
        uid = user.uid;
    }

    const [purchaserTrans, setPurchaserTrans] = useState([]);
    async function getPurchaserTransactions() {
        // gather each doc => tempDoc array
        const tempDoc = [];

        const transRef = collection(db, "transactions");
        const q = query(transRef, where("purchaser","==", `${authUser.email}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tempDoc.push(doc.data())
        });

        console.log("getPurchaserTransactions:", tempDoc);
        setPurchaserTrans(tempDoc);
    }

    const [requested, setRequested] = useState([]);
    async function getRequestedTransactions() {
        // gather each doc => tempDoc array
        const tempDoc = [];

        const transRef = collection(db, "transactions");
        const q = query(transRef, where("users", "array-contains", `${authUser.email}`), where("purchaser", "!=", `${authUser.email}`), where("paid", "==", false));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tempDoc.push(doc.data())
        });

        console.log("getRequestedTransactions:", tempDoc);
        setRequested(tempDoc);
    }

    useEffect(() => {
        // Loads on first render
        getPurchaserTransactions();
        getRequestedTransactions();

        // Loads every 30 minutes 
        const timer = setTimeout(() => {
            getPurchaserTransactions();
            getRequestedTransactions();
          }, 1800000); // (time in milliseconds)
          return () => clearTimeout(timer);
    }, [allUserData]);
    
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


    if (!loggedIn) {
        return(
            <div style={{margin:'15px', fontWeight:'normal'}}>
                <h1 style={{fontWeight:'normal'}}>Please login.</h1>
            </div>
        )
    }

    return (
    <div className="allpayments">
        <div className="owed" style={{height: '40%'}}>
            <p style={{textAlign: 'left', fontSize:'36px', margin: '0'}}>Requested from Others</p>
            <div style={{display:'flex', flexDirection:'row', overflowX:'scroll'}}>
                {purchaserTrans && purchaserTrans.map( (item) => <TransactionCard transaction={item} location={'allpayments'} allUserData={allUserData}/>)}
                {!!!purchaserTrans  && <p>No payments to be made.</p>}
            </div>
        </div>
        <div className="requested" style={{height: '40%'}}>
            <p style={{textAlign: 'left',fontSize:'36px', margin: '0'}}>Requested by Others</p>
            <div style={{display:'flex', flexDirection:'row', overflowX:'scroll'}}>
                {requested && requested.map( (item) => <TransactionCard transaction={item} location={'allpayments-requested'} allUserData={allUserData}/>)}
                {!!!requested && <ReqPopUp user={user} allUsersData={allUserData} location={'allpayments'}/>}
            </div>
        </div>
    </div>
)}

export default AllPayments;