import { IonAlert, IonAvatar, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {auth, db, UserContext} from ".."
import { Redirect, useHistory } from 'react-router';
import { arrowBack, camera, close, closeCircle, heart, pin, reload, settings } from "ionicons/icons";
import  firebase from "firebase/app";
import './perfil.css';

import { useCamera, availableFeatures } from "@ionic/react-hooks/camera";

const Profile: FC = () => {  
  
  const user = useContext(UserContext);
  const history = useHistory();
  const [displayName, setDisplayName] = useState('');
  const [anuncios, setAnuncios] = useState(0);
  const [chats, setChats] = useState(0);
  const [favoritos, setFavoritos] = useState(0);

  const [alertText, setAlertText] = useState('');

  const onDidDismiss = useCallback(() => setAlertText(''), []);



  const [dentro, setDentro] = useState(false);

  const numAnuncios = async () => {
    try {
      console.log('99')
      const res = await db
        .collection("anuncio")
        .where("idUsuario", "==", user?.id)
        .get();
        console.log('--------------------------------------------');
        console.log(res.size);
        setAnuncios(res.size);

    } catch (error) {}
  };
  const numFavoritos = async () => {
    try {
      console.log('99')
      const res = await db
        .collection("favoritos")
        .where("idUsuarioActual", "==", user?.id)
        .get();
        console.log('--------------------------------------------');
        console.log(res.size);
        setFavoritos(res.size);

    } catch (error) {}
  };
  const numChats = async () => {
    try {
      console.log('99')
      const res = await db
        .collection("chat")
        .where("idUsuarioActual", "==", user?.id)
        .get();
        console.log('--------------------------------------------');
        console.log(res.size);
        setChats(res.size);

    } catch (error) {}
  };
  if( dentro == false){
    if(!user) history.push('/login');
    setDentro(true);
    
  }  


  useEffect(() => {
    if(!user) history.push('/login');
    numAnuncios();
    numFavoritos();
    numChats();
  },[])


  return(

  <IonPage>
     <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink="/">
            <IonIcon slot="start" icon={arrowBack}/>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton routerLink="/editar-perfil">
          <IonIcon slot="start" icon={settings}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    <IonContent>
      <IonList>
      <IonItemGroup>
          <IonChip className="centrar-chip">
            <IonLabel className="centrar-chip-label"> {anuncios} Anuncios</IonLabel>
          </IonChip>
          <IonChip className="centrar-chip">
            <IonLabel className="centrar-chip-label"> {favoritos} Favoritos</IonLabel>
          </IonChip>
          <IonChip className="centrar-chip">
            <IonLabel className="centrar-chip-label"> {chats} Chats</IonLabel>
          </IonChip>
        </IonItemGroup>
      <IonAvatar className="centrar-foto" >
        <img src={user?.photo}/>
        </IonAvatar>
        <IonItem>
          <IonLabel  >{user?.displayName}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel  >{user?.selectedDate?.split("T")[0]}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel  >{user?.genero}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>{user?.telefono}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel >{user?.estudios}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel >{user?.universidad}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel >{user?.ciudad}</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Intereses</IonLabel>
        </IonItem>
        <IonItemGroup>
        {user?.deportes? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Deportes</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Deportes</IonLabel>
          </IonChip>
          }
          {user?.viajar? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Viajar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Viajar</IonLabel>
          </IonChip>
          }
          {user?.futbol? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Fútbol</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Fútbol</IonLabel>
          </IonChip>
          }
          {user?.musica? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Música</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Música</IonLabel>
          </IonChip>
          }
          {user?.netflix? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Netflix</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Netflix</IonLabel>
          </IonChip>
          }
          {user?.arte? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Arte</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Arte</IonLabel>
          </IonChip>
          }
          {user?.cine? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Cine</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Cine</IonLabel>
          </IonChip>
          }
          {user?.leer? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Leer</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Leer</IonLabel>
          </IonChip>
          }
          {user?.gamer? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Gamer</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Gamer</IonLabel>
          </IonChip>
          }
          {user?.snowboard? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Snowboard</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Snowboard</IonLabel>
          </IonChip>
          }
          {user?.caminar? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Caminar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Caminar</IonLabel>
          </IonChip>
          }
          {user?.animales? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Animales</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Animales</IonLabel>
          </IonChip>
          }
          {user?.surf? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Surf</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Surf</IonLabel>
          </IonChip>
          }
          {user?.cantar? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Cantar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Cantar</IonLabel>
          </IonChip>
          }
          {user?.yoga? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Yoga</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Yoga</IonLabel>
          </IonChip>
          }
          {user?.escalada? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Escalada</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Escalada</IonLabel>
          </IonChip>
          }
          {user?.idiomas? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Idiomas</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Idiomas</IonLabel>
          </IonChip>
          }
          {user?.correr? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Correr</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Correr</IonLabel>
          </IonChip>
          }
          {user?.crossfit? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Crossfit</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Crossfit</IonLabel>
          </IonChip>
          }
          {user?.acampada? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Acampada</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Acampada</IonLabel>
          </IonChip>
          }
          {user?.fotografia? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Fotografia</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Fotografia</IonLabel>
          </IonChip>
          }
          {user?.vegano? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Vegan</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Vegan</IonLabel>
          </IonChip>
          }
          {user?.comedia? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Comedia</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Comedia</IonLabel>
          </IonChip>
          }
          {user?.gym? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Gym</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Gym</IonLabel>
          </IonChip>
          }
          {user?.eSports? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">eSports</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >eSports</IonLabel>
          </IonChip>
          }
          {user?.disney? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Disney</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Disney</IonLabel>
          </IonChip>
          }
          {user?.ciclismo? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Ciclismo</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label">Ciclismo</IonLabel>
          </IonChip>
          }
          {user?.festivales? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label">Festivales</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Festivales</IonLabel>
          </IonChip>
          }
          {user?.bailar? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Bailar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Bailar</IonLabel>
          </IonChip>
          }
          {user?.instagram? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" >Instagram</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" >Instagram</IonLabel>
          </IonChip>
          }
        </IonItemGroup>


        <IonItem>
          <IonLabel>Última búsqeuda en:</IonLabel>
          <IonLabel >{user?.busqueda}</IonLabel>

        </IonItem>
        < IonButton color="secondary" 
            routerLink="/editar-perfil"
          >Restaurar Contraseña</IonButton>
          < IonButton color="danger" 
          onClick={() => auth.signOut()}
          >Cerrar Sesión</IonButton>
           
      </IonList>
      </IonContent>
      <IonAlert
          isOpen={alertText.length > 0}
          onDidDismiss={onDidDismiss}
          message={alertText}
          buttons={['Continuar']}
        />
  </IonPage>
  );
};

export default Profile;
