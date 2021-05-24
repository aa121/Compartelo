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
    IonButton} from '@ionic/react';
import React, {useEffect,useCallback,useContext,useState} from 'react';
import {db, UserContext} from ".."
import firebase from 'firebase';
import './Anuncios.css';
import { bedOutline, cubeOutline, heart, logoEuro, waterSharp } from 'ionicons/icons';
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

const Buscar: React.FC = () => {
  const user = useContext(UserContext);
  const [searchLocalidad, setsearchLocalidad] = useState<string | undefined>("");


  const [searchTipo, setsearchTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");


  //Crear anuncio
  const [listaEquipo, setListaEquipo] = useState<anuncio[]>([]);
  const [mensaje, setMensaje] = useState(false);

  //Para el componente de anuncio para acceder a cada anuncio del listado.
  const [myModal, setMyModal] = useState({isOpen:false});
  const [anuncioActual, setAnuncioActual] = useState('');

  const listar = async () => {
    try {
      let lista: anuncio[] = [];
      const res = await db
        .collection("anuncio")
        .where("localidad", "==", searchLocalidad)
        .where("propiedad", "==", searchTipo)
        .get();
      res.forEach((doc) => {
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
        console.log('123')
        console.log(doc.id)
        lista.push(obj);
      });
      setListaEquipo(lista);
    } catch (error) {}
  };
  console.log("aLLLLL");


  //Vamos a crear en la bd una tabla con el ID usuario y un array de anuncios favoritos
  const favoritos = async (idAnuncio:string) => {
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
  }
  const abrirAnuncio = (id:string) =>{
    setMyModal({isOpen:true})
    setAnuncioActual(id);
   // favoritos(id);
  }

  const buscar  = useCallback(async () => {
    db.collection('users')
    .doc(user?.id)
    .update({busqueda:searchLocalidad, tipoBusqueda:searchTipo }) 
    .catch(e => console.log("Error guardando búsqueda"));
    }, [searchLocalidad]);



  //Como uso un Hook para filtrar los anuncios del ususario se carga despues de lsitar los anuncios por lo que hasta que no sea válido no llamo a la función, solo una vez

  useEffect(() => {
    if(searchLocalidad== ""){
      var busqeudaAntigua = user?.busqueda;
      var tipoAntiguo = user?.tipoBusqueda;
      setsearchLocalidad(busqeudaAntigua);
      //setsearchTipo(tipoBusqueda)
    }
    console.log(searchLocalidad);
    listar();
  
  },[myModal]);

  useEffect(() => {
    console.log(searchLocalidad);
    listar();
    if(searchLocalidad != "" && searchTipo != ""){
      buscar();
    }
  
  },[searchLocalidad]);

  return (
    <IonPage>
      <IonToast
        isOpen={mensaje}
        onDidDismiss={() => setMensaje(false)}
        message="anuncio guardado"
        duration={500}
      />
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mis anuncios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
      <MyModal 
        isOpen={myModal.isOpen} 
        variables={{name:anuncioActual}}
        onClose={()=> setMyModal({isOpen:false})} 
        onDidDismiss={()=> setMyModal({isOpen:false})}

        />
        <IonSearchbar
          showCancelButton="focus"
          cancelButtonText="Custom Cancel"
          value={searchLocalidad}
          onIonChange={(e) => setsearchLocalidad(e.detail.value!)}
        ></IonSearchbar>
        <IonItem>
          <IonLabel>Tipo de propiedad</IonLabel>
          <IonSelect value={searchTipo} okText="Okay" cancelText="Dismiss" onIonChange={e => setsearchTipo(e.detail.value)}>
            <IonSelectOption value="Piso">Piso</IonSelectOption>
            <IonSelectOption value="Casa">Casa</IonSelectOption>
            <IonSelectOption value="Oficina">Oficina</IonSelectOption>
            <IonSelectOption value="Garaje">Garaje</IonSelectOption>
            <IonSelectOption value="Trastero">Trastero</IonSelectOption>
            <IonSelectOption value="Local comercial">Local comercial</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
            <IonSegmentButton value="Alquiler">
              <IonLabel>Alquiler</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="Venta">
              <IonLabel>Venta</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="Compartir">
              <IonLabel>Compartir</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonItem>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Listado de anuncios</IonTitle>
          </IonToolbar>
        </IonHeader>
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
        < IonButton color="secondary" 
            routerLink="/buscar-inteligente"
          >Búsqueda estudaintes</IonButton>
      </IonContent>
    </IonPage>
  );
};
export default Buscar;

