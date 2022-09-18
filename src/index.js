import { initializeApp } from "firebase/app";
import { getFirestore, collection,  onSnapshot, //getDocs,
    addDoc,deleteDoc,doc,   
    query,where,
    orderBy,serverTimestamp,
    getDoc,updateDoc,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDMX0Karmw8Qhik_fmXZZJcLQkiJ9kenG4",
  authDomain: "fir-demo-e3947.firebaseapp.com",
  projectId: "fir-demo-e3947",
  storageBucket: "fir-demo-e3947.appspot.com",
  messagingSenderId: "375216250443",
  appId: "1:375216250443:web:31c79bcaaa9b676565f7ce",
};

//init firebase app
initializeApp(firebaseConfig);

//init services
const db = getFirestore();

//user authentication
const auth = getAuth();

//collcetion ref
const colRef = collection(db, "my_books"); //my_books db name in firestore

//queries
// const q = query(colRef,where("author","==","tst"),orderBy('title','desc'));
const q = query(colRef,orderBy('createdAt'));

//real time collection data

const unsubCol = onSnapshot(q,(snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });
    // books.sort((a,b)=>{
    //   return a.title > b.title ? 1 : 0;
    // });
    console.log(books);
})    

/*
https://console.firebase.google.com/project/fir-demo-e3947/firestore/indexes
*/

// //get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//adding doc
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  })
  .then(() => {
    addBookForm.reset();
  });
});

//deleteing doc
const delBookForm = document.querySelector(".delete");
delBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
    const docRef = doc(db,"my_books",delBookForm.id.value);
    deleteDoc(docRef)
    .then(() =>  {
        delBookForm.reset();
    })
    .catch(err => {
        console.log(err.message);
    })

});

//get a single document
const docRef = doc(db,'my_books','mlwlM7FR8F4ofUm8ei2S');

// getDoc(docRef)
//   .then((doc) => {
//     console.log(doc.data(),doc.id);
//   })

const unsubDoc = onSnapshot(docRef,(doc) => {    
    console.log(doc.data(),doc.id);
})    

//signup form
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit',(e) => {
  e.preventDefault();

  const email = signupForm.email.value;
  const password = signupForm.password.value;
  createUserWithEmailAndPassword(auth,email,password)
  .then((credential) =>  {
    // console.log('user created',credential.user);
    signupForm.reset();
  }) 
  .catch (err => console.log(err.message))
})

//logout
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click',(e) => {
  signOut(auth)
  .then(() => {
    console.log('user signed out')
  })
  .catch(err => console.log(err.message))
})

//login
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit',(e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth,email,password)
  .then((credential) => console.log('user logined in',credential.user))
  .catch(err => console.log(err.message))

})

const unsubAuth = onAuthStateChanged(auth,(user) => {
  console.log('user status changed:',user);
})

//unsubscribe 
var unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click',() => {
  console.log('unsubscribing');
  unsubCol();
  unsubDoc();
  unsubAuth();
})
