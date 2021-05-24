import { IonButton, IonContent, IonHeader, IonItem, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {auth, UserContext} from '../'
import { Redirect, useHistory} from 'react-router';
const Home: React.FC = () => {
  const user = useContext(UserContext);
  const history = useHistory();
  const [isSignOut, setIsSignOut] = useState(false);
  const [dentro, setDentro] = useState(false);



const salir= useCallback(() =>  {
  setIsSignOut(true);
  auth.signOut().catch((err) => {
    console.log({err});
  setIsSignOut(false);
});
}, [])
if( dentro ==false){
  if(!user)  <Redirect to="/prueba" />
  setDentro(true);
}  
if(!user)  <Redirect to="/prueba" />
 return(
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Blank</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem>
          <IonText>Bienvenido: {user?.displayName}</IonText>
        </IonItem>
        <IonItem>
          < IonButton color="primary"  //disabled={isSignOut}
          onClick={salir}
          >
            Salir {isSignOut ? '':''}
          </IonButton>
        </IonItem>
        <IonItem>
          < IonButton 
            color="secondary"  
            routerLink="/perfil"
          >
            Perfil 
          </IonButton>
        </IonItem>
        <IonItem>

        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
  );
}
export default Home;
