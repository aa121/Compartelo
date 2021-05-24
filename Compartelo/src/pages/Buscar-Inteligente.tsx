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
    IonRange,
    IonItemDivider} from '@ionic/react';
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
  gustos:number,
  //empresa:boolean,//Anunciado por particural o empresa
  //huspedes?:string, //En caso de que sea compartida la casa inicar el número de habitaiones disponibles o la gente que hay en el piso 
}

interface usuario{ 
  idUsuario: string|undefined, 
  deportes: boolean|undefined,
  viajar: boolean|undefined,
  futbol: boolean|undefined,
  musica: boolean|undefined,
  netflix: boolean|undefined,
  arte: boolean|undefined,
  cine: boolean|undefined,
  leer: boolean|undefined,
  gamer: boolean|undefined,
  
  snowboard?: boolean|undefined,
  caminar?: boolean|undefined,
  animales?: boolean|undefined,
  surf?: boolean|undefined,
  cantar?: boolean|undefined,
  yoga?: boolean|undefined,
  escalada?: boolean|undefined,
  idiomas?: boolean|undefined,
  correr?: boolean|undefined,
  crossfit?: boolean|undefined,
  acampada?: boolean|undefined,
  fotografia?: boolean|undefined,
  vegano?: boolean|undefined,
  comedia?: boolean|undefined,
  gym?: boolean|undefined,
  eSports?: boolean|undefined,
  disney?: boolean|undefined,
  ciclismo?: boolean|undefined,
  festivales?: boolean|undefined,
  bailar?: boolean|undefined,
  instagram?: boolean|undefined,
  cantidadGustos: number,
  cantidadGustosUsuario: number,

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

  const [gustosUsuario, setGustosUsuario] = useState<usuario[]>([]);
  const [arrayOrdenado, setArrayOrdenado] = useState<usuario[]>([]);
  const [dentro, setDentro] = useState(false);
  const [dentroTiender, setDentroTiender] = useState(false);
  const [dentroAnunciantes, setDentroAnunciantes] = useState(false);
  const [compatibilidad, setCompatibilidad] = useState('0');

  /*const ObtenerGustosUsuario = async () => {
    let lista: usuario[] = [];

    try {
      console.log('***************************')
      console.log('Listando gustos de usuario')

      var userId = user?.id;
      const gustos = await db
      .collection("users")
      .where("id", "==", user?.id)
      .get();
      gustos.forEach((doc) => {        
        let obj = {
          idUsuario: userId,
          deportes: doc.data().deportes,
          viajar: doc.data().viajar,
          futbol: doc.data().futbol,
          musica: doc.data().musica,
          netflix: doc.data().netflix,
          arte: doc.data().arte,
          cine: doc.data().cine,
          leer: doc.data().leer,
          gamer: doc.data().gamer,
        };
        lista.push(obj);
      });
      setGustosUsuario(lista);

    } catch (error) {}
  }
*/
/*
  const gustosAnunciantes = async () => {
    try {
      console.log('***************************')
      console.log('Listando gustos de usuario')
      //console.log(listaEquipo[0].idUsuario)

      let lista: usuario[] = [];
      for(var i = 0; i < listaEquipo.length;i++){
        console.log('77777777777777777777777')
        console.log(listaEquipo[i].idUsuario)
        const gustos = await db
        .collection("users")
        //.where("id", "==", listaEquipo[i].idUsuario)
        .get(); 
        gustos.forEach((doc) => {        
          let obj = {
            idUsuario: doc.data().id,
            deportes: doc.data().deportes,
            viajar: doc.data().viajar,
            futbol: doc.data().futbol,
            musica: doc.data().musica,
            netflix: doc.data().netflix,
            arte: doc.data().arte,
            cine: doc.data().cine,
            leer: doc.data().leer,
            gamer: doc.data().gamer,
          };
       console.log(doc.data().id)
       
       console.log('77777777777777777777777')

          lista.push(obj);
        });
        console.log('999999999999999999999')
        console.log(gustos.size)

      console.log(lista)

        setGustosUsuario(lista);
      }

    } catch (error) {
      console.log("Error " + error + "Listando gustos de anunciantes")
    }
}*/

const gustosAnunciantes = async () => {
  try {
    console.log('***************************')
    console.log('Listando gustos de usuario')
    //console.log(listaEquipo[0].idUsuario)

    let lista: usuario[] = [];
    setGustosUsuario(lista);
    console.log('77777777777777777777777')
    const gustos = await db
    .collection("users")
    //.where("id", "==", listaEquipo[i].idUsuario)
    .get(); 
    gustos.forEach((doc) => {       
     // if(doc.id != user?.id){}
      let obj = {
        idUsuario: doc.id,
        deportes: doc.data().deportes,
        viajar: doc.data().viajar,
        futbol: doc.data().futbol,
        musica: doc.data().musica,
        netflix: doc.data().netflix,
        arte: doc.data().arte,
        cine: doc.data().cine,
        leer: doc.data().leer,
        gamer: doc.data().gamer,
        snowboard: doc.data().snowboard,
        caminar: doc.data().caminar,
        animales: doc.data().animales,
        surf: doc.data().surf,
        cantar: doc.data().cantar,
        yoga: doc.data().yoga,
        escalada: doc.data().escalada,
        idiomas: doc.data().idiomas,
        correr: doc.data().correr,
        crossfit: doc.data().crossfit,
        acampada: doc.data().acampada,
        fotografia: doc.data().fotografia,
        vegano: doc.data().vegano,
        comedia: doc.data().comedia,
        gym: doc.data().gym,
        eSports: doc.data().eSports,
        disney: doc.data().disney,
        ciclismo: doc.data().ciclismo,
        festivales: doc.data().festivales,
        bailar: doc.data().bailar,
        instagram: doc.data().instagram,
        cantidadGustos: 0,
        cantidadGustosUsuario: 0,
        
      };

     console.log(doc.data().id)
     
     console.log('7777777777777777777777')

        lista.push(obj);
      });
      console.log('999999999999999999999')
      console.log(gustos.size)

    console.log(lista)
    setGustosUsuario(lista);

  } catch (error) {
    console.log("Error " + error + "Listando gustos de anunciantes")
  } finally{
    console.log('----------------------')
    tinder();
  }
}
useEffect(() => {
  if(dentroTiender == false && gustosUsuario.length!=0){
    tinder();
    setDentroTiender(true);
  }

},[gustosUsuario]);

    //Vamos a comparar nuestros gusto con los del propietario del anuncio
    const tinder = async () => {
      try {
        console.log("Tinder: ");
        console.log(gustosUsuario);
        var cantidad = 0;
        var cantidadUsuario = 0;

        for(var i = 0; i < gustosUsuario.length;i++){
        console.log("Tinder2222222222222222: ");
          console.log(gustosUsuario[i]);
          cantidad = 0;
          if((user?.deportes == gustosUsuario[i].deportes)&& user?.deportes != false){
            cantidad ++;
          }
          if((user?.viajar == gustosUsuario[i].viajar) && user?.viajar != false ){
            cantidad ++;
          }
          if((user?.futbol == gustosUsuario[i].futbol) && user?.futbol != false){
            cantidad ++;
          }if((user?.musica == gustosUsuario[i].musica) && user?.musica != false){
            cantidad ++;
          }if((user?.netflix == gustosUsuario[i].netflix) && user?.netflix != false){
            cantidad ++;
          }if((user?.arte == gustosUsuario[i].arte) && user?.arte != false){
            cantidad ++;
          }if((user?.cine == gustosUsuario[i].cine) && user?.cine != false){
            cantidad ++;
          }if((user?.leer == gustosUsuario[i].leer) && user?.leer != false){
            cantidad ++;
          }if((user?.gamer == gustosUsuario[i].gamer) && user?.gamer != false){
            cantidad ++;
          }
          if((user?.snowboard == gustosUsuario[i].snowboard)&& user?.snowboard != false){
            cantidad ++;
          }
          if((user?.caminar == gustosUsuario[i].caminar) && user?.caminar != false ){
            cantidad ++;
          }
          if((user?.animales == gustosUsuario[i].animales) && user?.animales != false){
            cantidad ++;
          }if((user?.surf == gustosUsuario[i].surf) && user?.surf != false){
            cantidad ++;
          }if((user?.cantar == gustosUsuario[i].cantar) && user?.cantar != false){
            cantidad ++;
          }if((user?.yoga == gustosUsuario[i].yoga) && user?.yoga != false){
            cantidad ++;
          }if((user?.escalada == gustosUsuario[i].escalada) && user?.escalada != false){
            cantidad ++;
          }if((user?.idiomas == gustosUsuario[i].idiomas) && user?.idiomas != false){
            cantidad ++;
          }if((user?.correr == gustosUsuario[i].correr) && user?.correr != false){
            cantidad ++;
          }
          if((user?.crossfit == gustosUsuario[i].crossfit)&& user?.crossfit != false){
            cantidad ++;
          }
          if((user?.acampada == gustosUsuario[i].acampada) && user?.acampada != false ){
            cantidad ++;
          }
          if((user?.fotografia == gustosUsuario[i].fotografia) && user?.fotografia != false){
            cantidad ++;
          }if((user?.vegano == gustosUsuario[i].vegano) && user?.vegano != false){
            cantidad ++;
          }if((user?.comedia == gustosUsuario[i].comedia) && user?.comedia != false){
            cantidad ++;
          }if((user?.gym == gustosUsuario[i].gym) && user?.gym != false){
            cantidad ++;
          }if((user?.eSports == gustosUsuario[i].eSports) && user?.eSports != false){
            cantidad ++;
          }if((user?.disney == gustosUsuario[i].disney) && user?.disney != false){
            cantidad ++;
          }if((user?.ciclismo == gustosUsuario[i].ciclismo) && user?.ciclismo != false){
            cantidad ++;
          }if((user?.festivales == gustosUsuario[i].festivales) && user?.festivales != false){
            cantidad ++;
          }if((user?.bailar == gustosUsuario[i].bailar) && user?.bailar != false){
            cantidad ++;
          }if((user?.instagram == gustosUsuario[i].instagram) && user?.instagram != false){
            cantidad ++;
          }

        

          //Cantidad de gustos del usuario
          if((user?.deportes == true)){
            cantidadUsuario ++;
          }
          if((user?.viajar == true)){
            cantidadUsuario ++;
          }
          if((user?.futbol == true)){
            cantidadUsuario ++;
          }if((user?.musica == true)){
            cantidadUsuario ++;
          }if((user?.netflix ==  true)){
            cantidadUsuario ++;
          }if((user?.arte == true)){
            cantidadUsuario ++;
          }if((user?.cine == true)){
            cantidadUsuario ++;
          }if((user?.leer == true)){
            cantidadUsuario ++;
          }if((user?.gamer == true)){
            cantidadUsuario ++;
          }
          if((user?.snowboard == true)){
            cantidadUsuario ++;
          }
          if((user?.caminar ==  true)){
            cantidadUsuario ++;
          }
          if((user?.animales == true)){
            cantidadUsuario ++;
          }if((user?.surf == true)){
            cantidadUsuario ++;
          }if((user?.cantar == true)){
            cantidadUsuario ++;
          }if((user?.yoga == true)){
            cantidadUsuario ++;
          }if((user?.escalada == true)){
            cantidadUsuario ++;
          }if((user?.idiomas ==  true)){
            cantidadUsuario ++;
          }if((user?.correr == true)){
            cantidadUsuario ++;
          }
          if((user?.crossfit == true)){
            cantidadUsuario ++;
          }
          if((user?.acampada ==true)){
            cantidadUsuario ++;
          }
          if((user?.fotografia == true)){
            cantidadUsuario ++;
          }if((user?.vegano == true)){
            cantidadUsuario ++;
          }if((user?.comedia ==  true)){
            cantidadUsuario ++;
          }if((user?.gym == true)){
            cantidadUsuario ++;
          }if((user?.eSports == true)){
            cantidadUsuario ++;
          }if((user?.disney == true)){
            cantidadUsuario ++;
          }if((user?.ciclismo == true)){
            cantidadUsuario ++;
          }if((user?.festivales == true)){
            cantidadUsuario ++;
          }if((user?.bailar == true)){
            cantidadUsuario ++;
          }if((user?.instagram == true)){
            cantidadUsuario ++;
          }
 


          console.log("cantidad: " + cantidad);
          console.log("cantidadGustosUsuario: " + cantidadUsuario);

          gustosUsuario[i].cantidadGustos = cantidad;
          gustosUsuario[i].cantidadGustosUsuario = cantidadUsuario;

          cantidad = 0;
          cantidadUsuario = 0;
          }

      //setGustosUsuario(gustosUsuario);

        console.log("Lista final : " );
        console.log(gustosUsuario);
        //var ordenar = gustosUsuario.sort((a, b) => a.cantidadGustos - b.cantidadGustos);
        var ordenar = gustosUsuario.sort(function(a, b) {
          var keyA = a.cantidadGustos,
            keyB = b.cantidadGustos;
          console.log("Holaaa: " + keyA);
          console.log("Holaaa2: " + keyB);
            
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        }); 
        console.log("Lista final ordenada: " );
        console.log(ordenar);
        //Me guardo el array ordenado
        //setArrayOrdenado(ordenar);
        //Ahora voy a fitra por numero de gusto similares y comento el de encima que va bien
        var nuevo = [];
        var pos = 0;
        for(var i = 0; i < ordenar.length;i++){
          //Algorítmo de ordenacion
          console.log('?¿?¿?¿' + parseInt(compatibilidad))

          var Algoritmo = (parseInt(compatibilidad)*ordenar[i].cantidadGustosUsuario)/100;
          //Si tengo 15 gustos y el anunciante 30 entonces hace falta un 200% para tener los mismos gustos por lo que al tener mis 15 totales iguales somos iguales
          //Se podría cambiar al algoritmo a como estaba antes ((parseInt(compatibilidad)*30)/100 )) y así se compara siempre con 30 y tener 15 de 30 sería el 50% pero esto es más real
          if(Algoritmo > 100){
            Algoritmo = 100;
          }
          console.log('?¿?¿?¿Algoritmo' + Algoritmo + " gUSTOS: " + ordenar[i].cantidadGustos)

          if(ordenar[i].cantidadGustos >= Algoritmo){
            nuevo[pos] = ordenar[i];
            pos++;
          }
        }
        console.log('**********' + nuevo.length)

        setArrayOrdenado(nuevo);
        //Listamos los anuncios
        console.log('+-+-+-++--+-+-+')
        console.log(ordenar)
        //listarAnunciantes();      
      } catch (error) {
        console.log("Error " + error + "Listando gustos de anunciantes")
      } finally{
        console.log('----------------------')
        //listarAnunciantes();      
      }
  }

  useEffect(() => {
      listarAnunciantes();
      setDentroAnunciantes(true);
      console.log('----------------------')
    
  
  },[arrayOrdenado]);

const listarAnunciantes = async () => {
  let lista: anuncio[] = [];
  var nuevo: anuncio[] = [];

  setListaEquipo([]);
  console.log("cruckkkkkkkkkkkkkkkkkkkkkkkk");
  //nuevo = listaEquipo;
  console.log(nuevo);
  console.log(arrayOrdenado.length);

  for(var i = 0; i < arrayOrdenado.length;i++){
    try {
              

      
        const res = await db
          .collection("anuncio")
          .where("idUsuario", "==", arrayOrdenado[i].idUsuario)
          //.where("propiedad", "==", searchTipo)
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
            gustos: 0,
            

          }; 
          
          lista.push(obj);
        console.log("objeto: "+ i + " ¡:¡ " + obj);

        });
        console.log("listaaaaaaaaaa: " + lista);
        var nuevo2: anuncio[] = [];
        
        nuevo = [];
        //nuevo = listaEquipo.concat(lista);
        console.log("nuevoooooooooo: " + nuevo);
        //setListaEquipo([]);

      setListaEquipo(nuevo.concat(lista));
      nuevo = [];
      console.log(arrayOrdenado.length);

    

    } catch (error) {}
  }
};

/*
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
          gustos: 0,

        };
        lista.push(obj);
      });
      setListaEquipo(lista);
    } catch (error) {}
  };

*/

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
    //listar();
  
  
  },[myModal]);
  


  useEffect(() => {
    if(dentro == false && arrayOrdenado.length!=0){
      console.log('44444444444444444')
      
      gustosAnunciantes();
      setDentro(true);
    }
  
  },[arrayOrdenado]);

  useEffect(() => {
    console.log('Borrramos')

    gustosAnunciantes();
    


  
  },[compatibilidad]);
  useEffect(() => {
    console.log('Borrramos')

    gustosAnunciantes();
    


  
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

          <IonItemDivider>Compatibilidad</IonItemDivider>
        <IonItem>
          <IonRange onIonChange={e => setCompatibilidad(e.detail.value.toString())} min={0} max={100} pin color="secondary" >
            <IonLabel slot="start">0%</IonLabel>
            <IonLabel slot="end">100%</IonLabel>
          </IonRange>
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
      </IonContent>
    </IonPage>
  );
};
export default Buscar;

