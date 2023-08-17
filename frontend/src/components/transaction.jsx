import React, { useEffect, useState } from "react";
import "./components.css";
import { updateDoc, collection, getDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { Button } from "reactstrap";
import { getAuth } from "firebase/auth";

// user - JSON obj: name, pfp (link), email
// transaction - JSON obj: description / items (maybe 2 separate fields), amount, date, purchaser, users

const auth = getAuth();

const TransactionCard = ({ transaction, location, loggedIn, allUserData, loading, setLoading }) => {
    const [paid, setPaid] = useState(false);
    const [purchaserObj, setPurchaserObj] = useState();
    const [usersInfo, setUsersInfo] = useState([])

    // USER
    const user = auth.currentUser;
    var firstName = '';
    var lastName = '';
    var email = '';
    var uid = '';

    // Payment Status
    const { item, cost, users, date, purchaser } = transaction;

    useEffect(() => {
        const obj = allUserData.find((element) => element.email === purchaser);
        setPurchaserObj(obj);

        const temp = [];
        for (let index = 0; index < users.length; index++) {
            const email = users[index];
            const obj = allUserData.find((element) => element.email === email);
            if (email !== purchaser) {
                temp.push(obj);
            }
        }
        setUsersInfo(temp);
    }, [loading])

    const dividedAmount = (cost / users.length);
    const d = new Date(date.replace('-', '/')); // The (/) fix the one day off bug

    const itemUserFirstNames = [];
    for (let index = 0; index < usersInfo.length; index++) {
        const element = usersInfo[index];
        if (element.email !== auth.currentUser.email) {
            itemUserFirstNames.push(element.firstName);
        } else {
            itemUserFirstNames.push('You');
        }
        
    }

    if (user !== null && user.displayName) {
        const displayName = user.displayName;
        firstName = displayName.split(" ")[0];
        lastName = displayName.split(" ")[1];
        email = user.email;
        uid = user.uid;
    } 

    if ((allUserData === null) || (user === null) || (!purchaserObj) || loading) {
        return <></>
    }

    // Handles submit to Cloud Firestore
    async function handleCheck(e) {
        e.preventDefault();
        console.log('sending to server');

        const newTransaction = transaction;
        const newUsers = newTransaction[users];

        // find index & set to true
        const index = newUsers.indexOf(user);
        const currUser = newUsers[index];
        currUser.paid = true;

        // update user & newTrans
        newUsers[index] = currUser;
        newTransaction.users = newUsers;

        // sends to firebase
        const docRef = await updateDoc(collection(db, "transactions"), newTransaction);
        console.log("Transaction written with ID: ", docRef.id);
    }

    return(
        <div className="trans-card" style={{minWidth:'350px', minHeight:'150px', width:'95%'}}>
            <div className="transaction-info" style={{margin:'15px'}}>
                {((email === purchaser))  ? 
                (<div className="transaction-desc">
                    <p style={{margin: "5px",  display:'inline'}}> 
                        <strong style={{fontSize:'1.25rem', color:'#0D99FF'}}>You </strong> 
                        requested <strong style={{fontSize:'1.25rem',color:'#FF3366'}}>${dividedAmount.toFixed(2)} </strong> {(usersInfo.length > 1) ? `each` : '' } for
                        <strong style={{fontSize:'1.25rem',color:'#AA55CC'}}> {item} </strong> from
                        <strong style={{fontSize:'1.25rem',color:'#FFA07A'}}> {itemUserFirstNames.map((name)=> name).join(", ")}</strong>
                        </p> 
                </div>) :
                (<div className="transaction-desc">
                    <p style={{margin: "5px",  display:'inline'}}> 
                        <strong style={{fontSize:'1.25rem', color:'#0D99FF'}}>{purchaserObj.firstName} </strong> {(users.includes(email)) ? (<><strong style={{fontSize:'1.25rem',color:'#FF3366'}}>${dividedAmount.toFixed(2)} </strong><p style={{display: 'inline', margin: '0px'}}>{(usersInfo.length > 1) ? `each` : '' }</p></>) : 
                        <p style={{display:'inline'}}>requested reimbursement</p>} for 
                        <strong style={{fontSize:'1.25rem',color:'#AA55CC'}}> {item} </strong> from
                        <strong style={{fontSize:'1.25rem',color:'#FFA07A'}}> {itemUserFirstNames.map((name)=> name).join(", ")} </strong>
                    </p> 
                </div>)}

                <div>
                    {(purchaser == auth.currentUser.email) ? <p className="transaction-amt" style={{margin:'10px', textAlign:'center',color:'#FF3366'}}><strong>Cost:</strong> ${cost}</p> : <></>}
                    <p className="transaction-amt"style={{margin:'10px', textAlign:'center'}}>{d.toLocaleDateString()}</p>
                    {/* {(location === 'allpayments') ? (<Button color="success" onClick={handleCheck}>✔️</Button>) : (<></>)} */}
                </div>
            </div>
        </div>
)};

export default TransactionCard;