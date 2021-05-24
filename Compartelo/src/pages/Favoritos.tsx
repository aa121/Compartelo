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
  IonButton,
  IonButtons} from '@ionic/react';
import React, {useEffect,useCallback,useContext,useState} from 'react';
import {db, UserContext} from ".."
import firebase from 'firebase';
import './Anuncios.css';
import { bedOutline, cubeOutline, heart, logoEuro, reload, waterSharp } from 'ionicons/icons';
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import Favoritos from './Favoritos';
import { MyModal } from './MyModal';


interface anuncio{ 
idUsuario:string,
id:string,
propiedad:string,//Tipo de imueble: piso, garajo, casa. ...
titulos:string,
url1: string,//Para carhar la foto de los archivos de Firebase
url2: string,//Para carhar la foto de los archivos de Firebase
url3: string,//Para carhar la foto de los archivos de Firebase
alojamiento:string,//Tipo de alojamiento: todo el lugar, compartir habitacion...
direccion:string,
localidad:string,
provincia:string,
codigoPostal:string,
longitud:number,
latitul:number,
metros:string,
habitaciones:string,
banios:string,
planta:string,
//empresa:boolean,//Anunciado por particural o empresa
//huspedes?:string, //En caso de que sea compartida la casa inicar el número de habitaiones disponibles o la gente que hay en el piso 
}

interface favoritos{ 
  idAnuncio:string,
  }


const Buscar: React.FC = () => {
const user = useContext(UserContext);
const [searchLocalidad, setsearchLocalidad] = useState("");
const [searchTipo, setsearchTipo] = useState("");


//Crear anuncio
const [listaEquipo, setListaEquipo] = useState<anuncio[]>([]);
const [mensaje, setMensaje] = useState(false);

//Para el componente de anuncio para acceder a cada anuncio del listado.
const [myModal, setMyModal] = useState({isOpen:false});
const [anuncioActual, setAnuncioActual] = useState('');
const [iniciar, setIniciar] = useState(false);
const [dentro, setDentro] = useState(false);
const [dentro2, setDentro2] = useState(false);
const [refrescado, setRefrescar] = useState(false);
const [anuncios, setAnuncios] = useState<favoritos[]>([]);


/*const listar = async (idAnuncio:string) => {
  try {
    const res = await db
      .collection("anuncio")
      //.where("id", "==", idAnuncio)
      .get();
    res.forEach((doc) => {
      console.log('Existen favoritos')
      if(idAnuncio == doc.id) {
        let obj = {
          idUsuario: doc.data().idUsuario,
          id: doc.id,
          propiedad: doc.data().propiedad,
          titulos: doc.data().titulos,
          url1: doc.data().url1,
          url2: doc.data().url2,
          url3: doc.data().url3,
          alojamiento: doc.data().alojamiento,
          direccion: doc.data().direccion,
          localidad: doc.data().localidad,
          provincia: doc.data().provincia,
          codigoPostal: doc.data().codigoPostal,
          longitud: doc.data().longitud,
          latitul: doc.data().latitul,
          metros: doc.data().metros,
          habitaciones: doc.data().habitaciones,
          banios: doc.data().banios,
          planta: doc.data().planta,
        };
        let nuevo = listaEquipo;
        for(var i = 0; i < nuevo.length;i++){
          console.log( i + ": " + nuevo[i]);
          if(nuevo[i].id == doc.id){
            nuevo.push(obj);
            setListaEquipo(nuevo);
          }else{
            console.log("Ya existe en favoritos esta vivienda");
          }
        }
        
        
      }
      console.log('123')
      console.log(doc.id)
    });
    console.log(listaEquipo);

  } catch (error) {}
};*/
const listar = async (idAnuncio:string) => {
  try {
    let lista: anuncio[] = [];

    const res = await db
      .collection("anuncio")
      //.where("id", "==", idAnuncio)
      .get();
    res.forEach((doc) => {
      console.log('Existen favoritos')
      if(idAnuncio == doc.id) {
        let obj = {
          idUsuario: doc.data().idUsuario,
          id: doc.id,
          propiedad: doc.data().propiedad,
          titulos: doc.data().titulos,
          url1: doc.data().url1,
          url2: doc.data().url2,
          url3: doc.data().url3,
          alojamiento: doc.data().alojamiento,
          direccion: doc.data().direccion,
          localidad: doc.data().localidad,
          provincia: doc.data().provincia,
          codigoPostal: doc.data().codigoPostal,
          longitud: doc.data().longitud,
          latitul: doc.data().latitul,
          metros: doc.data().metros,
          habitaciones: doc.data().habitaciones,
          banios: doc.data().banios,
          planta: doc.data().planta,
        };
        let nuevo = listaEquipo;
        if(!refrescado){
          nuevo = [];
          setRefrescar(true);
        }
        nuevo.push(obj);
        setListaEquipo(nuevo);
        

      }
      console.log('123')
      console.log(doc.id)
    });
    console.log(listaEquipo);

  } catch (error) {}
};
/*
useEffect(() => {
  if(dentro2 == false){
    console.log('holis')

    listar2();
    setDentro2(true);
  }

},);*/

const listar2 = async () => {
  try {
    
    let lista2: favoritos[] = [];
    console.log('99')
    setRefrescar(false);
    const res = await db
      .collection("favoritos")
      .where("idUsuarioActual", "==", user?.id)
      .get();
    res.forEach((doc) => {
      listar(doc.data().idAnuncio);
        console.log( doc.data().idUsuarioActual);
        console.log('09090909909');
        let obj = {
          idAnuncio: doc.data().idAnuncio,
        };
        lista2.push(obj);
    });
    setAnuncios(lista2);
    

    console.log('?¿?¿¿?' + lista2);

  } catch (error) {}
  finally{
    console.log("va bien*****************")
    //listarFavoritos();
  }
};
/*
useEffect(() => {
  console.log("Entro*****************")
  
  if(dentro == false){
  console.log("mejor*****************")
  listar2();
    listarFavoritos();
    setDentro(true);
  }

},[anuncios]);*/

const listarFavoritos = async () => {
  console.log('cantidad: ' + anuncios.length);

  for(var i = 0; i < anuncios.length;i++){
    console.log('hpppppp');
    console.log(anuncios[i].idAnuncio);

    listar(anuncios[i].idAnuncio);
  }
};


const refrescar = () =>{
  setListaEquipo([]);
  listar2();
}

const abrirAnuncio = (id:string) =>{
  setMyModal({isOpen:true})
  setAnuncioActual(id);
 // favoritos(id);
}

//Como uso un Hook para filtrar los anuncios del ususario se carga despues de lsitar los anuncios por lo que hasta que no sea válido no llamo a la función, solo una vez

if(user != undefined && !iniciar){
  console.log("88888888888888888");
  setListaEquipo([]);
    listar2();
    setIniciar(true);
  }

return (
  <IonPage>
    <IonToast
      isOpen={mensaje}
      onDidDismiss={() => setMensaje(false)}
      message="anuncio guardado"
      duration={500}
    />
    <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Favoritos</IonTitle>
          <IonButtons slot="end">
          <IonButton onClick={()=>refrescar()}routerLink="/favoritos">
          <IonIcon slot="start" icon={reload}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    <IonContent>
    <MyModal 
      isOpen={myModal.isOpen} 
      variables={{name:anuncioActual}}
      onClose={()=> setMyModal({isOpen:false})} 
      onDidDismiss={()=> setMyModal({isOpen:false})}

      />
      <IonList>
        {" "}
        {listaEquipo.map((anuncio) => (
          <IonCard   
            key={anuncio.id} 
            
            /*href={'/favoritos/'}*/ onClick={() =>
              abrirAnuncio(anuncio.id)
              /*<Favoritos  {..."hola"}>:</Favoritos>*/
              //setMyModal({isOpen:true})
            }
            
          >
            <IonCardContent>
              <IonCardTitle>Anuncio: </IonCardTitle>

              <IonItem>
                <IonSlides id="slides">
                  <IonSlide>
                    <img src={anuncio.url1} />
                  </IonSlide>
                  <IonSlide>
                    <img src={anuncio.url2} />
                  </IonSlide>
                  <IonSlide>
                    <img src={anuncio.url3} />
                  </IonSlide>
                </IonSlides>
              </IonItem>
              {/*<IonItem>
                              <IonImg src={anuncio.url1}/*Poner un ? : para ver si hay imágen escondo el input y si no hay escondo la foto, hacer 4 variables de imágen y subirlas a la BD  />
                          </IonItem> 
                          <IonItem>
                              <IonImg src={anuncio.url2}/*Poner un ? : para ver si hay imágen escondo el input y si no hay escondo la foto, hacer 4 variables de imágen y subirlas a la BD  />
                          </IonItem> 
                          <IonItem>
                              <IonImg src={anuncio.url3}/*Poner un ? : para ver si hay imágen escondo el input y si no hay escondo la foto, hacer 4 variables de imágen y subirlas a la BD  />
                          </IonItem> */}
              <IonCardTitle>Tipo de propiedad:</IonCardTitle>
              <IonCardTitle>{anuncio.propiedad}</IonCardTitle>

              <p>Tipo de alojamiento: {anuncio.alojamiento}</p>
              <p>{anuncio.titulos} € </p>
              <h4> <IonIcon icon={bedOutline} /> {anuncio.habitaciones} Hab. <IonIcon icon={waterSharp} /> {anuncio.banios} Baños   <IonIcon icon={cubeOutline} /> {anuncio.metros} M<sup>2</sup></h4>
            </IonCardContent>
          </IonCard>
        ))}
      </IonList>
    </IonContent>
  </IonPage>
);
};
export default Buscar;

