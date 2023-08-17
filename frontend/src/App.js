import './App.css';

// PAGES
import Landing from './pages/landing/landing';
import AllPayments from './pages/allPayments/allPayments';
import Person from './pages/person/[[person]]';
import Components from './pages/components/components';
import Error from './pages/error/error';

// ON ALL PAGES
import SideBar from './components/sidebar';
import Header from './components/header';

// FUNCTIONS
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
 

const auth = getAuth();

function App() {
  const defaultAllUserData = {
    allUserData: []
  };

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [authUser, setAuthUser] = useState({});
  const [allUserData, setAllUserData] = useState(defaultAllUserData);

  async function updateAllUserData(db) {
    // gather each doc => tempDoc array
    const tempDoc = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      tempDoc.push(doc.data())
    });
    console.log("allUserData:", tempDoc);
    // set allUserData
    setAllUserData(tempDoc);
    setLoading(false);
  }

  const [loggedIn, setLoggedIn] = useState(false);
  onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setLoggedIn(true);
        setAuthUser(user);
    } else {
        // User is signed out
        setLoggedIn(false);
    }
  });

  useEffect(() => {
    updateAllUserData(db);
    if (loggedIn && authUser) {
      console.log('attempting to get user info from db');
      try {
        getDoc(doc(db, "users", authUser.email))
        .then((doc) => {
            setUser(doc.data());
        })
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setUser();
      }
      console.log('FINISHED getting user info from db')
    }
  }, [loggedIn]);

  return (
    <div className='main'>
      <BrowserRouter> 
        <Header/>
        <Routes>
          {/* LANDING */}
          <Route path="/" element={<Landing user={user} setUser={setUser} allUserData={allUserData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser} loading={loading} setLoading={setLoading}/>} />
          <Route path="*" element={<Landing user={user} setUser={setUser} allUserData={allUserData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser} loading={loading} setLoading={setLoading}/>}/>
          <Route path="/landing" element={<Landing user={user} setUser={setUser} allUserData={allUserData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser} loading={loading} setLoading={setLoading}/>}/>

          {/* ALL PAYMENTS */}
          <Route path="/allpayments" element={<AllPayments user={user} setUser={setUser} allUserData={allUserData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser} loading={loading} setLoading={setLoading}/>}/>

          {/* PERSON */}
          <Route path="/*" element={<Person user={user} setUser={setUser} allUserData={allUserData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser} loading={loading} setLoading={setLoading}/>} />

          {/* COMPONENTS */}
          <Route path="/components" element={<Components/>}/>

          {/* ERROR */}
          <Route path="/error" element={<Error/>}/>
        </Routes>
        <div className='fixed-sidebar'>
          <SideBar user={user} setUser={setUser} allUserData={allUserData} loggedIn={loggedIn} setLoggedIn={setLoggedIn} authUser={authUser} setAuthUser={setAuthUser}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
