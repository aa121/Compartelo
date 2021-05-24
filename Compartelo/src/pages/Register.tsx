import { IonAlert, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { auth, db, UserContext } from '..';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {logoApple, logoGoogle} from 'ionicons/icons'
import firebase from 'firebase';

const Register: FC = () => {  

  const user = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState('');    
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    if(user) history.push('/')
  }, [])
 
  const onEmailChange = useCallback((e) => setEmail(e.detail?.value), []);
  const onPasswordChange = useCallback((e) => setPassword(e.detail?.value), []); 
  const onConfirmPasswordChange = useCallback((e) => setConfirmPassword(e.detail?.value), []); 

//Comprobamos que las contraseñas coinciden en el registro
  const onSignupClick = useCallback(() => {
    if(email.length === 0) setAlertText('Usuario requerido');
      else if(password.length === 0) setAlertText('Contraseña requerida');
      else if(password.length < 6) setAlertText('La contraseña debe tener al menos 6 caracteres.');
      else if(password !== confirmPassword )
       setAlertText('Las contraseñas no coinciden');
    else{
      auth
      .createUserWithEmailAndPassword(email, password)
      .then(res=>{//Obtenemos el nombre de usuario del correo
        db.collection('users')
        .doc(res.user?.uid)
        .set({displayName: email.split('@')[0]})
        .then(() => history.push('/'))
      })
      .catch (err => setAlertText(err.message))
      console.log('Registrado!');
    }
  }, [confirmPassword, password, email.length]);

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
    
  }, [email.length]);

  const onDidDismiss = useCallback(() => setAlertText(''), []);
  
 
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
        <IonLabel >Confima la contraseña:</IonLabel>
          <IonInput onIonChange={onConfirmPasswordChange}
          type = "password"
          value={confirmPassword}/>
        </IonItem>
        <IonItem>
          < IonButton color="primary" 
          onClick={onSignupClick}
          >
            Registrarse</IonButton>
          < IonButton color="secondary" routerLink="/login">Inciar sesión</IonButton>
          < IonButton color="secondary" routerLink="/home">Volver</IonButton>
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

export default Register;
