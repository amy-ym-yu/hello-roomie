import React from "react";
import './components.css';
import Popup from "reactjs-popup";
import { Alert, Form, FormGroup, Input, Label } from "reactstrap";
import { db } from '../firebase';
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
 
const auth = getAuth();

// FN: add user to firebase
async function addUserToDB(user) {
    try {
        const docRef = await setDoc(doc(db, "users", `${user.email}`), user);
        console.log("User Document written with user email: ", user.email);
        } catch (e) {
        console.error("Error adding document: ", e);
        }
}

export const CreateAcc = ({user, setUser, loggedIn, setLoggedIn, authUser, setAuthUser }) => { 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // TODO : add profile picture (if time permits)

    const navigate = useNavigate();
    const handleClick = () => navigate('/error');
    
    function addNewUser(e) {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            updateProfile(auth.currentUser, {
                displayName: displayName, photoURL: "https://example.com/jane-q-user/profile.jpg"
              }).then(() => {
                // Profile updated!
                sendEmailVerification(auth.currentUser);
                Alert('Account created!')
              }).catch((error) => {
                // An error occurred
                Alert('Error. Try again later!')
            });

            setAuthUser(user);
            console.log(user);

            // Add user to Cloud Firestore collection
            const dbUser = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                userID: user.uid
            };
            addUserToDB(dbUser);
            setUser(dbUser);
            setLoggedIn(true);
            alert("Account Created. Please refresh the page.")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage)
        });

        const displayName = firstName + " " + lastName;
    }

    return (
        <Popup trigger={<button style={{margin:'5px'}}>Create Account</button>} modal={true}>
            <h1 style={{marginBottom:'5px'}}>CREATE NEW ACCOUNT</h1>
            <p style={{marginTop:'5px'}}>If you have previously created an account, please login instead.</p>
            <Form style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <FormGroup style={{margin:'2.5px'}}>
                        <Label for="firstName" style={{marginRight:'5px'}}>First Name</Label>
                        <Input name="firstName" placeholder="ex. Amy" 
                            onChange={(e) => {
                                console.log(e.target.value)
                                setFirstName(e.target.value)
                            }}
                        />
                    </FormGroup>
                    <FormGroup style={{margin:'2.5px'}}>
                        <Label for="lastName" style={{marginRight:'5px'}}>Last Name</Label>
                        <Input name="lastName" placeholder="ex. Yu" 
                            onChange={(e) => {
                                console.log(e.target.value)
                                setLastName(e.target.value)
                            }}
                        />
                    </FormGroup>
                    <FormGroup style={{margin:'2.5px'}}>
                        <Label for="email" style={{marginRight:'5px'}}>Email</Label>
                        <Input name="email" placeholder="ex. janesmith@gmail.com"
                            onChange={(e) => {
                                console.log(e.target.value)
                                setEmail(e.target.value)
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password" style={{marginRight:'5px'}}>Password</Label>
                        <Input name="password" placeholder="ex. h3ll0r00m13"
                            onChange={(e) => {
                                console.log(e.target.value)
                                setPassword(e.target.value)
                            }}
                        />
                    </FormGroup>
                </div>
                <button style={{margin:'2.5px'}} onClick={addNewUser}>Submit</button>
            </Form>
        </Popup>
    )
}

export const Login = ({user, setUser, loggedIn, setLoggedIn, authUser, setAuthUser }) => { 
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // TODO : add profile picture (if time permits)

    async function addNewUser(e) {
        e.preventDefault();

        // Attempt sign in
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            // const user = userCredential.user;
            setAuthUser(userCredential.user);
            return userCredential.user;
        })
        .then((user) => {
            console.log('attempting to get user info from db');
            try {
              getDoc(doc(db, "users", user.email))
              .then((doc) => {
                  setUser(doc.data());
              })
            } catch (error) {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              setUser({});
            }
            setLoggedIn(true)
            console.log('finished getting user info from db')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            alert(errorMessage);
        });
    }

    return (
        <Popup trigger={<button style={{margin:'5px'}}>Login</button>} modal={true} >
            <h1>LOGIN</h1>
            <Form style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <FormGroup style={{margin:'2.5px'}}>
                        <Label for="email" style={{marginRight:'5px'}}>Email</Label>
                        <Input name="email" placeholder="ex. janesmith@gmail.com"
                            onChange={(e) => {
                                console.log(e.target.value)
                                setEmail(e.target.value)
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password" style={{marginRight:'5px'}}>Password</Label>
                        <Input name="password" placeholder="ex. h3ll0r00m13"
                            onChange={(e) => {
                                console.log(e.target.value)
                                setPassword(e.target.value)
                            }}
                        />
                    </FormGroup>
                </div>
                <button style={{margin:'2.5px'}} onClick={addNewUser}>Submit</button>
            </Form>
        </Popup>
    )
}