import  firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React,{ createContext, FC, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
//import * as serviceWorker from './service-worker';
import reportWebVitals from './reportWebVitals';
import { UserInfo } from "os";


//Configuración de fireBase
/*firebase.initializeApp({
  apiKey: "AIzaSyD78rCXpBYiQFaAWKcOT327DjIHOsQuExg",
  authDomain: "compartelo-1a6ea.firebaseapp.com",
  projectId: "compartelo-1a6ea",
  storageBucket: "compartelo-1a6ea.appspot.com",
  messagingSenderId: "1079319514193",
  appId: "1:1079319514193:web:2b6d974f6777cd2d59bc70",
  measurementId: "G-97XZYJJQ6E"
});*/


//BD de Prueba

firebase.initializeApp({
  apiKey: "AIzaSyDUKlnAzCYjmdGw6I_CdmBSn-xkYGZ-Q-w",
  authDomain: "prueba-91d8e.firebaseapp.com",
  projectId: "prueba-91d8e",
  storageBucket: "prueba-91d8e.appspot.com",
  messagingSenderId: "263631231365",
  appId: "1:263631231365:web:c9d569708f2dea0fc58cec"
});

export const auth = firebase.auth();
//Creamos la BD
export const db = firebase.firestore();

interface UserProps{
  age?: string;
  selectedDate?: string;
  displayName: string | null;
  id: string; 
  photo:string;
  genero?: string;
  telefono?: string;
  estudios?: string;
  universidad?: string;
  ciudad?: string;
  provincia?: string;
  deportes?: boolean;
  viajar?: boolean;
  futbol?: boolean;
  musica?: boolean;
  netflix?: boolean;
  arte?: boolean;
  cine?: boolean;
  leer?: boolean;
  gamer?: boolean;

  snowboard?: boolean;
  caminar?: boolean;
  animales?: boolean;
  surf?: boolean;
  cantar?: boolean;
  yoga?: boolean;
  escalada?: boolean;
  idiomas?: boolean;
  correr?: boolean;
  crossfit?: boolean;
  acampada?: boolean;
  fotografia?: boolean;
  vegano?: boolean;
  comedia?: boolean;
  gym?: boolean;
  eSports?: boolean;
  disney?: boolean;
  ciclismo?: boolean;
  festivales?: boolean;
  bailar?: boolean;
  instagram?: boolean;

  busqueda?: string;
  tipoBusqueda?: string;
  
}

export const UserContext = createContext<UserProps | undefined>(undefined)

const UserProvider: FC = ({children}) => {
  const[user, setUser] = useState<UserProps | undefined>(undefined)

  useEffect(() => {
    //Si no tiene la sesión iniciada el usuario es Null
    const unsubscribe = auth.onAuthStateChanged(async (u) =>{
    if (u?.uid) {
      db.collection('users')
      .doc(u?.uid)
      .onSnapshot((doc) => {
        if (doc.exists) 
        return setUser(({
          ...doc.data(),
            id: doc.id,
          } as unknown) as UserProps);
      }); 
    }
    return setUser(undefined);
  });
  return () => {
    unsubscribe();
  };
  },[])

  return <UserContext.Provider value={user}>
    {children}
  </UserContext.Provider>
}

//Prueba



ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById('root')
);
//const rootElement =   document.getElementById('root');


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

serviceWorkerRegistration.register();
//serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
