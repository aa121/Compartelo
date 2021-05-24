import { IonAlert, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {auth, UserContext} from "../"
import { Redirect, useHistory } from 'react-router';

//Meter recapcha -> https://www.youtube.com/watch?v=mP_t0VBBFhE

const ForgotPassword: FC = () => {  
  const user = useContext(UserContext);
  const [email, setEmail] = useState('');    
  const [alertText, setAlertText] = useState('');
  const history = useHistory();

  const onEmailChange = useCallback((e) => setEmail(e.detail?.value), []);


  const onSumbitClick = useCallback(() =>{
    auth.sendPasswordResetEmail(email)
    .then(() => setAlertText('Verifica tu correo'))
    .catch((err) => setAlertText(err.message));
  }, [email]);
  const onDidDismiss = useCallback(() => setAlertText(''), []);

  if(user) return <Redirect to='/'/>;

  
  return(

  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Contraseña olvidada</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem>
        <IonLabel >Email:</IonLabel>
          <IonInput onIonChange={onEmailChange} value={email}/>
        </IonItem>
        <IonItem>
          < IonButton color="primary" 
          onClick={onSumbitClick}
          >
            Enviar</IonButton>
          < IonButton color="secondary" routerLink="/login">Volver</IonButton>
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

export default ForgotPassword;
