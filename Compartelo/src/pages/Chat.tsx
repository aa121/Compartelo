/*import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';*/
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonList,
  IonItem,
  IonToast,
  IonSlide,
  IonSlides,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonToggle,
  IonAvatar,
  IonButton,
  IonButtons,
  IonMenu
} from '@ionic/react';
import React, {useEffect,useCallback,useContext,useState} from 'react';
import {db, UserContext} from ".."
import firebase from 'firebase';
import './Anuncios.css';
import { arrowBack, bedOutline, cubeOutline, heart, logoEuro, reload, waterSharp } from 'ionicons/icons';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import { MyModal2 } from './MyModal2';


interface chat{ 
idUsuarioActual:string,
createdAt:string,
idAnuncio:string,
idAnunciante:string,
nombre:string,
imagen: string
}

//Ubicación
interface LocationError {
showError: boolean;
message?: string;
}


const Chat: React.FC = (props) => {
const user = useContext(UserContext);
const [searchLocalidad, setsearchLocalidad] = useState("");
const [searchTipo, setsearchTipo] = useState("");
//Emisor del mensaje
const [idUsuario2, setIdUsuario2] = useState('');
const [createdAt, setCreatedAt] = useState('');
const [user2, setUser2] = useState('');
const [id, setId] = useState('');


//Crear anuncio
const [listaEquipo, setListaEquipo] = useState<chat[]>([]);
const [] = useState<string | undefined>(undefined);

const [mensaje, setMensaje] = useState(false);
const [arrayAnuncios, setArrayAnuncios] = useState(Array);
const [myModal, setMyModal] = useState({isOpen:false});
const [anuncioActual, setAnuncioActual] = useState('');

/* ****Esto en MyModal que es el desplegable 
  //Vamos a crear en la bd una tabla con el ID usuario, ID del usuario del propietario del Anuncio y un array de anuncios favoritos
  const contactar = async (idAnuncio:string) => {
    try {
      //En vez de esto paso como parámetro el id del anuncio en el que de click ç
      //Y lo meto en la BD como favorito
      //var anuncios = [idAnuncio];
      var anuncios = ["wXFRK2Np5s3f3FsRb9K4", "qBjlmL9ZmS9F7566HU4K", "gWzji6VCtBG9LS083ptn"];

        const idUsuario = user?.id;
        //Si no existe lo creo
        await db.collection('favoritos').add(
          {idUsuario,anuncios});
          
         
    } catch (error) {}
    //Una vez creado restablecemos los valores a vacíos
   
}*/





console.log(props);

const listar = async () => {
  try {
    let lista: chat[] = [];
    const res = await db.collection('chat')
    //.where("idAnuncio", "==", user?.id)
    //.where("idAnunciante" , "==", user?.id)
    .get(); 
  res.forEach((doc) => {
    console.log(user?.id);
    console.log(doc.data().idAnunciante);
    console.log(doc.data().idUsuarioActual);
    if((doc.data().idAnunciante == user?.id || doc.data().idUsuarioActual ==user?.id) && user?.id!= undefined){
      console.log(user?.id);
      console.log(doc.data().idAnunciante);
      console.log(doc.data().idUsuarioActual);

      let obj = {
        idUsuarioActual: doc.data().idUsuarioActual,
        createdAt: doc.data().createdAt,
        idAnuncio: doc.data().idAnuncio,
        idAnunciante: doc.data().idAnunciante,
        nombre: doc.data().nombre,
        imagen: doc.data().imagen,

      };
      lista.push(obj);
      console.log('1111 ');
    }else{
      console.log("hay algo mal obteniendo los chats")
      //console.log(user?.id);
    }
    });
    console.log('Noooo ');
    setListaEquipo(lista);
} catch (error) {
  console.log('Error listando*********** ');

}
};

const abrirAnuncio = (id:string) =>{
  setMyModal({isOpen:true})  
  setAnuncioActual(id);
 // favoritos(id);
}

//Como uso un Hook para filtrar los anuncios del ususario se carga despues de lsitar los anuncios por lo que hasta que no sea válido no llamo a la función, solo una vez

useEffect(() => {
  console.log(searchLocalidad);
  listar();
 // anuncios();
},[]);

return (
  <IonPage>

    
    <IonMenu side="start" content-id="main-content">
      <IonHeader>
        <IonToolbar >
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonIcon name="mail" slot="start"></IonIcon>
            <IonLabel>Inbox</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="paper-plane" slot="start"></IonIcon>
            <IonLabel>Outbox</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="heart" slot="start"></IonIcon>
            <IonLabel>Favorites</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="archive" slot="start"></IonIcon>
            <IonLabel>Archived</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="trash" slot="start"></IonIcon>
            <IonLabel>Trash</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="warning" slot="start"></IonIcon>
            <IonLabel>Spam</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>

    

    <IonToast
      isOpen={mensaje}
      onDidDismiss={() => setMensaje(false)}
      message="anuncio guardado"
      duration={500}
    />
    <IonHeader translucent>
        <IonToolbar>
          <IonTitle >Chats</IonTitle>
          <IonButtons slot="end">
          <IonButton onClick={()=>listar()}>
          <IonIcon slot="start" icon={reload}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

    <IonContent>
    <MyModal2 
      isOpen={myModal.isOpen} 
      variables={{name:anuncioActual,emisor:user?.id}}
      onClose={()=> setMyModal({isOpen:false})}
      onDidDismiss={()=> setMyModal({isOpen:false})}

      />
      
      <IonList>
        {" "}
        {listaEquipo.map(chat => (
          <IonItem onClick={() =>
            abrirAnuncio(chat.idAnuncio)
            /*<Favoritos  {..."hola"}>:</Favoritos>*/
            //setMyModal({isOpen:true})
            
          }>

          <IonAvatar slot="start">
            <img src={chat.imagen}>
            </img>
          </IonAvatar>
          <IonLabel>
            <h2>{chat.nombre}</h2>
            {/*<h3>I'm a big deal</h3>
            <p>Listen, I've had a pretty messed up day...</p>*/
        }
          {/*<IonCard
            key={chat.createdAt}
            onClick={() =>
              abrirAnuncio(chat.idAnuncio)
              /*<Favoritos  {..."hola"}>:</Favoritos>*/
              //setMyModal({isOpen:true})
              /*
            }
          >
            <IonCardContent>
              <IonCardTitle>Chat: </IonCardTitle>


              <IonCardTitle>Emisor:</IonCardTitle>
              <IonCardTitle>{chat.idUsuario}</IonCardTitle>

              <p>{chat.createdAt} € </p>
            </IonCardContent>
          </IonCard>*/}
          </IonLabel>
          </IonItem>

        ))}
      </IonList>
    </IonContent>
  </IonPage>
);
};
export default Chat;