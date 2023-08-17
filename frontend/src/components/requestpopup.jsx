import React, { useState } from "react";
import './components.css';
import { Form, FormGroup, Input, Label } from "reactstrap";
import Multiselect from 'multiselect-react-dropdown';
import Popup from 'reactjs-popup';
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebase';
import { getAuth } from "firebase/auth";

const auth = getAuth();

const ReqPopUp = ({ allUsersData, location, loading}) => {
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

    const [itemUsers, setItemUsers] = useState([]);
    const [date, setDate] = useState('');
    const [itemName, setItem] = useState('');
    const [cost, setCost] = useState(0.0);

    if (allUsersData === []) {
        allUsersData = [{}];
    }

    // removes logged in user from drop down
    var multiselectOptions = [];
    for (let index = 0; index < allUsersData.length; index++) {
        const element = allUsersData[index];
        if (element.email !== auth.currentUser.email) {
            multiselectOptions.push(element);
        }
    }

    // Handles submit to Cloud Firestore
    async function submitRequest(e) {
        e.preventDefault();
        console.log('sending to server');

        const tempDoc = [];
        for (let index = 0; index < itemUsers.length; index++) {
            const element = itemUsers[index];
            const lowerEmail = element.email.toLowerCase()
            tempDoc.push(lowerEmail)
        }
        tempDoc.push(auth.currentUser.email);
        console.log(tempDoc);

        const paidObj = {};
        for (let index = 0; index < itemUsers.length; index++) {
            const element = itemUsers[index];
            paidObj[`${element.email}`] = false;
        }

        try {
            if (user === null) {
                throw new Error('No user authorized!');
            }

            const docRef = await addDoc(collection(db, "transactions"), {
                date: date,
                item: itemName,
                cost: cost,
                users: tempDoc,
                purchaser: email,
                paid: false,
                payments: paidObj
              });
            console.log("Transaction written with ID: ", docRef.id);
        } catch (error) {
            console.log(error);
            alert("Error! Try again later.");
        }

    }

    return (
        <div className="popup">
            <Popup trigger={ (location === 'sidebar') ? <button>Request</button> : <p style={{opacity:'50%'}}> + request reimbursement </p>} modal={true}>
                {close => (
                    <div className="modal">
                        <h1 style={{margin:'10px'}}>Request Reimbursement</h1>
                        <Form style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                            <FormGroup style={{display:'flex', flexDirection:'row', justifyContent:'space-around'}}>
                                <div style={{margin:'10px'}}>
                                    <Label for="date" style={{marginRight:'5px'}}>Date</Label>
                                    <Input id="purchase-date" placeholder="Date of Purchase" type="date"
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            setDate(e.target.value)
                                        }}
                                    />
                                </div>
                                <div style={{display:'flex', flexGrow:'2', justifyContent:"center", margin:'10px'}}>
                                    <Label for="item" style={{marginRight:'5px'}}>Item(s)</Label>
                                    <Input id="item-desc" placeholder="Toothpaste, eggs, cereal..." type="text" style={{width:'80%'}}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            setItem(e.target.value)
                                        }}
                                    />
                                </div>
                                <div style={{margin:'10px'}}>
                                    <Label for="cost" style={{marginRight:'5px'}}>Cost</Label>
                                    <Input id="cost" placeholder="$12.34..." type="number" step="0.01"
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            setCost(e.target.value)
                                        }}
                                    />
                                </div>
                            </FormGroup>
                            <FormGroup style={{display:'flex', flexDirection:'row', justifyContent:'center', margin:'10px'}}>
                                <Label for="users" style={{marginRight:'5px'}}>Select Users</Label>
                                <Multiselect 
                                    displayValue="firstName"
                                    options={multiselectOptions} 
                                    onRemove={(e) => {
                                        console.log(e);
                                        setItemUsers(e);
                                    }}
                                    onSelect={(e) => {
                                        console.log(e);
                                        setItemUsers(e);
                                    }}
                                />
                            </FormGroup>
                            <FormGroup style={{display:'flex', justifyContent:'center', margin:'10px'}}>
                                <button onClick={(e) => {
                                    submitRequest(e);
                                    close();
                                }} 
                                    style={{width:'150px', height:'30px'}}>Request Money</button>
                            </FormGroup>
                        </Form>
                    </div>
                )}
            </Popup>
        </div>
    )
}

export default ReqPopUp;