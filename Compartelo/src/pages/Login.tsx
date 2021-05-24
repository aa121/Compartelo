import { IonAlert, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {auth, db, UserContext} from "../"
import { Redirect, useHistory } from 'react-router';
import firebase from 'firebase';
import { logoGoogle } from 'ionicons/icons';

const Login: FC = () => {  
  const user = useContext(UserContext);
  const [email, setEmail] = useState('');    
  const [password, setPassword] = useState('');
  const [alertText, setAlertText] = useState('');
  const history = useHistory();

  const onEmailChange = useCallback((e) => setEmail(e.detail?.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.detail?.value), []); 


  //Comprobamos que la contraseña no es vacía 
  const onLoginClick = useCallback(() => {
    if(email.length === 0) setAlertText('Usuario requerido');
    else if(password.length === 0) setAlertText('Contraseña requerida');
    else{
      auth.signInWithEmailAndPassword(email,password)
      .catch(err => setAlertText(err.message));
    }
  }, [password, email]);

    //Inicio de sesión copn Google
    const providerGoogle = new firebase.auth.GoogleAuthProvider();
    //Login con Facebook y Appple
    //const providerFacebook = new firebase.auth.FacebookAuthProvider;
    //const providerApple = new firebase.auth.ActionCodeURL();
  
    const onSignupClickGoogle = useCallback(() => {
      auth.signInWithPopup(providerGoogle)
        .then(res=>{//Obtenemos el nombre de usuario del correo
          db.collection('users')
          .doc(res.user?.uid)
          .set({displayName: email.split('@')[0]})
          .then(() => history.push('/'))
        })
        .catch (err => setAlertText(err.message))
        console.log('Registrado!');
      
    }, [ email.length]);


  const onDidDismiss = useCallback(() => setAlertText(''), []);

  if(user) return <Redirect to='/perfil'/>;

  
  return(

  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem>
        <IonLabel >Email:</IonLabel>
          <IonInput onIonChange={onEmailChange} value={email}/>
        </IonItem>
        <IonItem>
        <IonLabel >Contraseña:</IonLabel>
          <IonInput onIonChange={onPasswordChange}
          type = "password"
          value={password}/>
        </IonItem>
        <IonItem>
          < IonButton color="primary" 
          onClick={onLoginClick}
          >
            Login</IonButton>
          < IonButton color="secondary" routerLink="/home">Volver</IonButton>
          </IonItem>
          <IonItem>
          < IonButton color="secondary" routerLink="/register">Registro</IonButton>
          <IonItem>
          < IonButton color="secondary" routerLink="/forgotpassword">¿Has olvidado tu contraseña?</IonButton>
          </IonItem>
          </IonItem>
          <IonItem>
        < IonButton color="primary" 
          onClick={onSignupClickGoogle}
          >
            <IonIcon slot="start" icon={logoGoogle}/>
            Continuar con google </IonButton>
        </IonItem>

      </IonList>
      <IonAlert
          isOpen={alertText.length > 0}
          onDidDismiss={onDidDismiss}
          message={alertText}
          buttons={['Continuar']}
        />
      </IonContent>
  </IonPage>
  );
};

export default Login;
