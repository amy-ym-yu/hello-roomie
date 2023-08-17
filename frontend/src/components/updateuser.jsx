import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { getAuth, updateProfile, updateEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const auth = getAuth();

export const EditProfilePop = ({ location }) => {
    const user = auth.currentUser;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');

    async function deleteDocument(email) {
        await deleteDoc(doc(db, "users", email));
    }

    function handleNameChange(s) {
        if (name !== '') {
            updateProfile(auth.currentUser, {
                displayName: name
            }).then(() => {
                // Profile updated!
                updateDoc(doc(db, "users", auth.currentUser.email), {firstName: `${name.split(" ")[0]}`, lastName:  `${name.split(" ")[1]}`}, {merge: true});
                if (s !== 'save') {
                    alert('Your name has been updated!')
                }
            }).catch((error) => {
                // An error occurred
                if (s !== 'save') {
                    console.log(error);
                    alert('Error changing your name. Try again later!')
                }
            });
        } else {
            if (s !== 'save') {
                alert('Name Cannot be empty!')
            }
        }
    }

    function handleEmailChange(s) {
        if (email !== '') {
            const oldEmail = auth.currentUser.email;

            updateEmail(auth.currentUser, `${email}`).then(() => {
                // Email updated!
                try {
                    setDoc(doc(db, "users", email), {
                        firstName: auth.currentUser.displayName.split(" ")[0],
                        lastName: auth.currentUser.displayName.split(" ")[1],
                        userID: auth.currentUser.uid,
                        email: auth.currentUser.email
                    });
                    deleteDocument(oldEmail);
                } catch (error) {
                    if (s !== 'save') {
                        console.log(error);
                        alert('Error changing your email. Try again later!')
                    }
                }
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    // Email verification sent!
                    if (s !== 'save') {
                        alert('Your email has been updated! Check new email for confirmation.')
                    }
                });
              }).catch((error) => {
                // An error occurred
                if (s !== 'save') {
                    console.log(error);
                    alert('Error changing your email. Try again later!')
                }
              });
        } else {
            if (s !== 'save') {
                alert('Email cannot be empty!')
            }
        }
    }

    function handlePwChange(s) {
        if (pw !== '') {
            updatePassword(user, `${pw}`).then(() => {
                // Update successful.
                alert('Password successfully changed!');
              }).catch((error) => {
                // An error ocurred
                if (s !== 'save') {
                    console.log(error);
                    alert(`Error changing password! See below.\n${error.message}`);
                }
              });
        } else {
            if (s !== 'save') {
                alert('Password cannot be empty!')
            }
        }
    }



    return (
        <Popup trigger={<button>Edit Profile</button>} modal={true}>
            {close => (
                <div className="modal" style={{textAlign:'center'}}> 
                    <h1 style={{margin:'10px'}}>User Profile</h1>
                    <div className="user-info" style={{textAlign:'left'}}>
                        <div>
                            <strong style={{display:'inline'}}>Name:</strong> <input style={{display:'inline'}} defaultValue={user.displayName} 
                                onChange={(e) => {console.log(e.target.value); setName(e.target.value)}}/>
                            <button style={{display:'inline', margin:'5px'}} onClick={handleNameChange}>Change Name</button>
                        </div>
                        {/* <div>
                            <strong>Email:</strong> <input style={{display:'inline'}} defaultValue={user.email}
                                onChange={(e) => {console.log(e.target.value); setEmail(e.target.value)}}/>
                            <button style={{display:'inline', margin:'5px'}} onClick={handleEmailChange}>Change Email</button>
                        </div> */}
                        <div>
                            <strong>Enter New Password:</strong> <input style={{display:'inline'}} defaultValue={user.password}
                                onChange={(e) => {console.log(e.target.value); setPw(e.target.value)}}/>
                            <button style={{display:'block', margin:'5px', textAlign:'center'}} onClick={handlePwChange}>Change Password</button>
                        </div>
                        {/* <div style={{display:'flex', alignItems:'center'}}>
                            <button onClick={() => {const s = 'save'; handleNameChange(s); handleEmailChange(s); handlePwChange(s); close(); alert('Your profile has been saved.')}}>Save All Changes</button>
                        </div> */}
                    </div>
                </div>
            )}
        </Popup>
    )
}