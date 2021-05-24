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
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    useIonViewWillEnter,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonToast,
    IonProgressBar,
    IonImg,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonItemDivider,
    IonRange,
    IonLoading,
    IonChip,
    IonSlide,
    IonSlides,
    IonToggle,
    IonText
} from '@ionic/react';
import React, {useEffect,useCallback,useContext,useState} from 'react';
import { addOutline, trashBinOutline, pencil, pin, bedOutline, cubeOutline, waterSharp } from 'ionicons/icons';
import {db, UserContext} from ".."
import firebase from 'firebase';
import { camera } from "ionicons/icons";
import './Anuncios.css';
//Para pasar de coordinadas a la ubicación
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';

//Para subir img..
import { CameraResultType } from "@capacitor/core";
import { useCamera, availableFeatures } from "@ionic/react-hooks/camera";
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
  //Formato del archivo a subir a FB junto con el porcentaje de carga
  type DataAsDataUrl = { dataUrl: string; format: string };
  type UploadDataResponse =
  | { metaData: firebase.storage.FullMetadata; downloadUrl: any }
  | undefined;
type ProgressResponse = { value: number } | undefined | null;
type UploadSource = File | DataAsDataUrl | undefined;
//Para pasar de coordinadas a la ubicación
let options: NativeGeocoderOptions = {
  useLocale: true,
  maxResults: 5
};
/*
{"latitude":38.3985887,"longitude":-0.5192569,"countryCode":"ES","countryName":"España","postalCode":"03690",
"administrativeArea":"Comunidad Valenciana","subAdministrativeArea":"Alicante","locality":"Sant Vicent del Raspeig",
"subLocality":"","thoroughfare":"Avinguda de la Libertad","subThoroughfare":"70","areasOfInterest":["70"]}*/
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
  ascensor:boolean,
  aire:boolean,
  calefaccion:boolean,
  microondas:boolean,
  certificadoElectrico:boolean,
  eficienciaConsumo:string,
  consumo:string,
  eficienciaEmisiones:string,
  emisiones:string,
  //empresa:boolean,//Anunciado por particural o empresa
  //huspedes?:string, //En caso de que sea compartida la casa inicar el número de habitaiones disponibles o la gente que hay en el piso 
}

//Hay que exportar el id del anuncio al darle click para que cuando le demos click al ionCard se abra y se pueda vovler
//export const idcontext = createContext(id);

//Ubicación
interface LocationError {
  showError: boolean;
  message?: string;
}
const Anuncios: React.FC = () => {
    const user =  useContext(UserContext);
   
  
    const [, setAlertText] = useState('');
  
      //Para subir la imgaen.. junto con el porcentaje de carga y errores
    // camera hook!!
    const { photo, getPhoto } = useCamera();
   //Cosntantes para subir foto a FireBase
    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [url3, setUrl3] = useState('');
    //Para saber que foto vamos a subir creo este 
    const [fotoActual, setFotoActual] = useState('');

    // the data from the file upload response
    const [, setDataResponse] = useState<UploadDataResponse>()
    // sets properties on the file to be uploaded
    const [] = useState<UploadSource>();
    // if we are loading a file or not
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // if an error happened during the process
    const [, setIsError] = useState<any>(false);
    // used for tracking the % of upload completed
    const [progress, setProgress] = useState<ProgressResponse>(null);
    var storageRef = firebase.storage().ref();

    //Crear anuncio
    const [listaEquipo, setListaEquipo] = useState < anuncio[] > ([]); 
    const [id, setId] = useState('');
    const [] = useState<string | undefined>(undefined);
    const [propiedad, setPropiedad] = useState('');
    const [titulos, setTitulos] = useState('');
    const [mensaje, setMensaje] = useState(false);
    const [existe, setExiste] = useState(true);
    //Lo uso para cargar los anuncios una vex cargado el componente.(Porque si no se cargan los anuncios y cuando se carga el componente no aparecen)
    const [dentro, setDentro] = useState(false);
    const [alojamiento, setAlojamiento] = useState<string | undefined>(undefined);
    const [direccion, setDireccion] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [provincia, setProvincia] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [longitud, setLongitud] = useState(0);
    const [latitul, setLatitul] = useState(0);
    const [metros, setMetros] = useState('');
    const [habitaciones, setHabitaciones] = useState('');
    const [banios, setBanios] = useState('');
    const [planta, setPlanta] = useState('');

    //IONTOOGLE
    const [ascensor, setAscensor] = useState(false);
    const [aire, setAire] = useState(false);
    const [calefaccion, setCalefaccion] = useState(false);
    const [microondas, setMicroondas] = useState(false);
    const [certificadoElectrico, setCertificadoElectrico] = useState(false);
    const [eficienciaConsumo, setEficienciaConsumo] = useState('');
    const [consumo, setConsumo] = useState('');
    const [eficienciaEmisiones, setEficienciaEmisiones] = useState('');
    const [emisiones, setEmisiones] = useState('');




    const [] = useState(false);
    const [] = useState('');

//Ubicación 
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<LocationError>({ showError: false });
const [, setPosition] = useState<Geoposition>();



const listar = async () => {
  
  try {
      let lista: anuncio[] = []
      const res = await db.collection('anuncio').where("idUsuario", "==", user?.id).get();
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
              ascensor: doc.data().ascensor,
              aire: doc.data().aire,
              calefaccion: doc.data().calefaccion,
              microondas: doc.data().microondas,
              certificadoElectrico: doc.data().certificadoElectrico,
              eficienciaConsumo: doc.data().eficienciaConsumo,
              consumo: doc.data().consumo,
              eficienciaEmisiones: doc.data().eficienciaEmisiones,
              emisiones: doc.data().emisiones,
          };
          
          lista.push(obj)

      });
      setListaEquipo(lista)
  } catch (error) {}
}
  console.log('aLLLLL');

console.log(user)
  const crear = async () => {
    /*if(propiedad!=''){
      ... Hacerlo para todos los campos privados y que no pueda crear anuncio sin los campos obligatorios 
    }else{
      console.log('El campo propiedad es obligatorio');
    }*/
      console.log('Estoy');
      try {
          const idUsuario = user?.id;
          //Si no existe lo creo
          if(existe){
              await db.collection('anuncio').add(
                  {propiedad, titulos,url1,url2,url3,idUsuario,alojamiento,direccion,localidad,provincia,codigoPostal,longitud,latitul,metros,habitaciones,banios,planta,
                    ascensor,aire,calefaccion,microondas,certificadoElectrico,eficienciaConsumo,consumo,eficienciaEmisiones,emisiones});
          }else{//Si existe el anuncio lo modifi con set()
            console.log('Estoy2');
            console.log(id);

              await db.collection('anuncio').doc(id).set(
                  {propiedad, titulos,url1,url2,url3,idUsuario,alojamiento,direccion,localidad,provincia,codigoPostal,longitud,latitul,metros,habitaciones,banios,planta,
                    ascensor,aire,calefaccion,microondas,certificadoElectrico,eficienciaConsumo,consumo,eficienciaEmisiones,emisiones});
                  setExiste(true);
          }
            
      } catch (error) {}
      console.log('id')

      console.log(id)

      //Una vez creado restablecemos los valores a vacíos
      setId('');
      setPropiedad('');
      setTitulos('');
      setUrl1('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png');
      setUrl2('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png');
      setUrl3('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png');
      setAlojamiento('');
      setDireccion('');
      setLocalidad('');
      setProvincia('');
      setCodigoPostal('');
      setLongitud(0);
      setLatitul(0);
      setFotoActual('');
      setMetros('');
      setHabitaciones('');
      setBanios('');
      setPlanta('');
      setAscensor(false);
      setAire(false);
      setCalefaccion(false);
      setMicroondas(false);
      setCertificadoElectrico(false);
      setEficienciaConsumo('');
      setConsumo('');
      setEficienciaEmisiones('');
      setEmisiones('');
      setMensaje(true);
      listar();  

  }


    const eliminar = async(id:string) =>{
        try {
            console.log(id)
            await db.collection('anuncio').doc(id).delete();
            listar();  
        } catch (error) {}       
    }
    const editar = (id:string,propiedad:string, titulo:string,alojamiento: string, direccion:string,localidad:string, provincia:string,codigoPostal:string,
      longitud:number,latitul:number, url1:string,url2:string,url3:string,metros:string,habitaciones:string,banios:string,planta:string,ascensor:boolean,
      aire:boolean,calefaccion:boolean,microondas:boolean,certificadoElectrico:boolean,eficienciaConsumo:string,consumo:string,eficienciaEmisiones:string,emisiones:string) => {
console.log('1');

      setId(id);
      setPropiedad(propiedad);
      setTitulos(titulo);
      setUrl1(url1);
      setUrl2(url2);
      setUrl3(url3);
      setAlojamiento(alojamiento);
      setDireccion(direccion);
      setLocalidad(localidad);
      setProvincia(provincia);
      setCodigoPostal(codigoPostal);
      setLongitud(longitud);
      setLatitul(latitul);
      setMetros(metros);
      setHabitaciones(habitaciones);
      setBanios(banios);
      setPlanta(planta);
      setAscensor(ascensor);
      setAire(aire);
      setCalefaccion(calefaccion);
      setMicroondas(microondas);
      setCertificadoElectrico(certificadoElectrico);
      setEficienciaConsumo(eficienciaConsumo);
      setConsumo(consumo);
      setEficienciaEmisiones(eficienciaEmisiones);
      setEmisiones(emisiones);
      setExiste(false);

      //....
  } 



    //Subir imágen*****************************************************************************
    //FB
//Subimos el archivo
const takePicture = (foto:string) => {
      //Establezco como foto a subir al icono que le de en la App
      if (availableFeatures.getPhoto) {
      if(foto=='foto1') {
        setFotoActual('foto1');
      }else if(foto=='foto2'){
        setFotoActual('foto2');
      }else if('foto3'){
        setFotoActual('foto3');
      }
      getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });
    }
  
  };
  
  //Lo subo a la DB de Firebase
    const setUp = (_value:typeof photo): firebase.storage.UploadTask => {
  
      if (_value instanceof File) {
        let fName = `${new Date().getTime()}-${_value.name}`;
        // setting the firebase properties for the file upload
        let ref = storageRef.child("images/" + fName);
        return ref.put(_value);
      } else {
        let v = _value as DataAsDataUrl;
        let fName = `${new Date().getTime()}.${v.format}`;
        // setting the firebase properties for the file upload
        let ref = storageRef.child("images/" + fName);
        return ref.putString(v.dataUrl, "data_url");
      }
    };
    const uploadData = async (url:string) => {
      // initialize upload information
      setIsError(false);
      setIsLoading(true);
  
      setProgress({ value: 0 });
  
      // handle a file upload or a dataUrl upload
      let uploadTask = setUp(photo);
  
      // wrap the whole thing in a try catch block to update the error state
      try {
        // tracking the state of the upload to assist in updating the
        // application UI
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          _progress => {
            var value = _progress.bytesTransferred / _progress.totalBytes;
            console.log("Upload is " + value * 100 + "% done");
            setProgress({ value });
          },
          _error => {
            setIsLoading(false);
            setIsError(_error);
          },
          async () => {
            setIsError(false);
            setIsLoading(false);
  
            // need to get the url to download the file
            let downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
  
            // set the data when upload has completed
            setDataResponse({
              metaData: uploadTask.snapshot.metadata,
              downloadUrl
            });
            if(fotoActual == 'foto1'){
              setUrl1(downloadUrl);
            }else if(fotoActual == 'foto2'){
              setUrl2(downloadUrl);
            } else if(fotoActual == 'foto3'){
              setUrl3(downloadUrl);
            }
            console.log('estoy generando url');
            console.log(url)
            console.log(downloadUrl)
            try{
               db.collection('anuncio').doc(id)
              .update({ photo: downloadUrl,})
              .then(() => setAlertText("Cambiado correcatamente"))
              .catch((err) => setAlertText(err.message));
            }catch(_error){
                console.log("Error: " + _error); 
            }
            // reset progress
            setProgress(null);
          }
        );
      } catch (_error) {
        setIsLoading(false);
        setIsError(_error);
      }
    };

    //Como uso un Hook para filtrar los anuncios del ususario se carga despues de lsitar los anuncios por lo que hasta que no sea válido no llamo a la función, solo una vez 
    if(user != undefined && dentro ==false){
        listar();
        console.log('??');
        setDentro(true);
      }

    useEffect(() => {
      //Si se ha subido imágen la subo a Firebase
      if(url1==''){
          setUrl1('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png');
          listar();
      }
      if(url2==''){
        setUrl2('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png');
        listar();
    }
    if(url3==''){
      setUrl3('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png');
      listar();
  }


        if(photo!=undefined){
          if(fotoActual=='foto1'){
            uploadData('foto1');
          }else if(fotoActual=='foto2'){
            uploadData('foto2');
          }else if(fotoActual=='foto3'){
            uploadData('foto3');
          }
          
        }//Si photo es null es decir al cargar la pantalla, cargo los datos sólo una vez (si lo dejo fuera se actualizar cada vez que subo una foto pero claro si modificas nombre y subes foto se va e nombre a no se de que pirmero nombre y luego foto )
    },[photo])
    useIonViewWillEnter(() => {
        listar();
        console.log('555')

    })
    //const p =  NativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options);
  // console.log(p);

    //Botón Para obtener la ubicación
    const getLocation = async () => {
      //console.log(NativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options).then((result: NativeGeocoderResult[]) => console.log(JSON.stringify(result[0]))));

      setLoading(true);

      try {
          const position2 = await Geolocation.getCurrentPosition();
          setPosition(position2);
          //Me guardo longitud y latitud
          setLongitud(position2.coords.longitude);
          setLatitul(position2.coords.latitude);

          setPropiedad(`${position2.coords.latitude}:
                       ${position2.coords.longitude}`);
        //Tras obtener las coordenadas lo paso a datos con Geocoder obteniendo direccion, localcidad, codigo postal...
        NativeGeocoder.reverseGeocode(position2.coords.latitude, position2.coords.longitude, options)
        .then((result: NativeGeocoderResult[]) => setLocalidad(JSON.stringify(result[0].locality.split('"', 2))))
          setLoading(false);//localidad,codigo postal, 
          setError({ showError: false });
          //Me guardo ahora la calle
          NativeGeocoder.reverseGeocode(position2.coords.latitude, position2.coords.longitude, options)
        .then((result: NativeGeocoderResult[]) => setCodigoPostal(JSON.stringify(result[0].postalCode.split('"', 2))))
          setLoading(false);//localidad,codigo postal, 
          setError({ showError: false });
          //Me guardo ahora ...
          NativeGeocoder.reverseGeocode(position2.coords.latitude, position2.coords.longitude, options)
        .then((result: NativeGeocoderResult[]) => setDireccion(JSON.stringify(result[0].thoroughfare.split('"', 2))))
          setLoading(false);//localidad,codigo postal, 
          setError({ showError: false });
          //Me guardo ahora ...
          NativeGeocoder.reverseGeocode(position2.coords.latitude, position2.coords.longitude, options)
          .then((result: NativeGeocoderResult[]) => setProvincia(JSON.stringify(result[0].subAdministrativeArea.split('"', 2))))
            setLoading(false);//localidad,codigo postal, 
            setError({ showError: false });


          //crearMapa();
      } catch (e) {
          setError({ showError: true, message: e.message });
          setLoading(false);
      }
  }
  //Obtener mapa meidante Google Maps
   return (
    <IonPage>
    <IonToast
       isOpen={mensaje}
       onDidDismiss={() => setMensaje(false)}
       message="anuncio guardado"
       duration={500}
      />
        <IonHeader>
        <IonLoading
        //Errores y oanbtalla de carga para la geolocalización
                isOpen={loading}
                onDidDismiss={() => setLoading(false)}
                message={'Getting Location...'}
            />
            <IonToast
                isOpen={error.showError}
                onDidDismiss={() => setError({ message: "", showError: false })}
                message={error.message}
                duration={3000}
            />
            
            <IonToolbar color="primary">
                <IonTitle>Mis anuncios</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>

            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Gestión de anuncios</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonCard>
            <IonItemDivider>Datos del inmueble</IonItemDivider>
            <IonItem>
            <IonLabel>Alquiler</IonLabel>
                <IonSegment onIonChange={e => setAlojamiento(e.detail.value)}>
                  <IonSegmentButton value="Alquiler" defaultChecked>
                    <IonLabel>Alquiler</IonLabel >
                  </IonSegmentButton>
                  <IonSegmentButton value="Venta">
                    <IonLabel>Venta</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="Estudiantes">
                    <IonLabel>Estudiantes</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonItem>
                <IonItem>
                  <IonLabel>Tipo de inmueble</IonLabel>
                  <IonSelect value={propiedad} okText="Okay" cancelText="Dismiss" onIonChange={e => setPropiedad(e.detail.value)}>
                    <IonSelectOption value="Piso">Piso</IonSelectOption>
                    <IonSelectOption value="Casa">Casa</IonSelectOption>
                    <IonSelectOption value="Oficina">Oficina</IonSelectOption>
                    <IonSelectOption value="Garaje">Garaje</IonSelectOption>
                    <IonSelectOption value="Trastero">Trastero</IonSelectOption>
                    <IonSelectOption value="Local comercial">Local comercial</IonSelectOption>
                  </IonSelect>
                </IonItem>
              {/*  <IonItem>
                  <IonLabel>Tipo de operación </IonLabel>
                  <IonSelect value={alojamiento} okText="Okay" cancelText="Dismiss" onIonChange={e => setAlojamiento(e.detail.value)}>
                    <IonSelectOption value="Todo el lugar">Todo el lugar</IonSelectOption>
                    <IonSelectOption value="Habitación privada">Habitación privada</IonSelectOption>
                    <IonSelectOption value="Habitación compartida">Habitación compartida</IonSelectOption>
                  </IonSelect>
                </IonItem>*/}
                <IonItemDivider>Precio mensual</IonItemDivider>
                <IonItem>
                                        <p>{titulos/**Centrar */}</p>
                  <IonRange onIonChange={e => setTitulos(e.detail.value.toString())} min={0} max={10000} pin color="secondary" >
                    <IonLabel slot="start">0€</IonLabel>
                    <IonLabel slot="end">10000€</IonLabel>
                    
                  </IonRange>
                </IonItem>
                <IonItem>
                  <p>Precio: {" "}</p>
                    <IonInput value={titulos}
                        placeholder="precio mensual"
                        onIonChange={ e => setTitulos(e.detail.value!) }
                    ></IonInput>
                    
                </IonItem>
                <IonItemDivider>Distribuciíon</IonItemDivider>
                <IonItem>
                                        <p>{metros/**Centrar */}</p>
                  <IonRange onIonChange={e => setMetros(e.detail.value.toString())} min={0} max={10000} pin color="secondary" >
                    <IonLabel slot="start">0 M<sup>2</sup></IonLabel>
                    <IonLabel slot="end">10000 M<sup>2</sup></IonLabel>
                    
                  </IonRange>
                </IonItem>
                <IonItem>
                  <IonLabel>Núm. habitaciones:</IonLabel>
                  <IonSelect value={habitaciones} okText="Okay" cancelText="Dismiss" onIonChange={e => setHabitaciones(e.detail.value)}>
                    <IonSelectOption value="1">1</IonSelectOption>
                    <IonSelectOption value="2">2</IonSelectOption>
                    <IonSelectOption value="3">3</IonSelectOption>
                    <IonSelectOption value="4">4</IonSelectOption>
                    <IonSelectOption value="5">5</IonSelectOption>
                    <IonSelectOption value="6">6</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel>Núm. Baños:</IonLabel>
                  <IonSelect value={banios} okText="Okay" cancelText="Dismiss" onIonChange={e => setBanios(e.detail.value)}>
                    <IonSelectOption value="1">1</IonSelectOption>
                    <IonSelectOption value="2">2</IonSelectOption>
                    <IonSelectOption value="3">3</IonSelectOption>
                    <IonSelectOption value="4">4</IonSelectOption>
                    <IonSelectOption value="5">5</IonSelectOption>
                    <IonSelectOption value="6">6</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel>Núm. planta:</IonLabel>
                  <IonSelect value={planta} okText="Okay" cancelText="Dismiss" onIonChange={e => setPlanta(e.detail.value)}>
                    <IonSelectOption value="1">1</IonSelectOption>s
                    <IonSelectOption value="2">2</IonSelectOption>
                    <IonSelectOption value="3">3</IonSelectOption>
                    <IonSelectOption value="4">4</IonSelectOption>
                    <IonSelectOption value="5">5</IonSelectOption>
                    <IonSelectOption value="6">6</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItemDivider>Caracteristicas y equipamiento</IonItemDivider>
                <IonItem>
                  <IonLabel>Ascensor: {JSON.stringify(ascensor? 'Si':'No').split('"', 2)}</IonLabel>
                  <IonToggle slot='start'checked={ascensor} onIonChange={e => setAscensor(e.detail.checked)} />
                </IonItem>
                <IonItem>
                  <IonLabel>Aire acondicionado: {JSON.stringify(aire? 'Si':'No').split('"', 2)}</IonLabel>
                  <IonToggle slot='start'checked={aire} onIonChange={e => setAire(e.detail.checked)} />
                </IonItem>
                <IonItem>
                  <IonLabel>Calefacción: {JSON.stringify(calefaccion? 'Si':'No').split('"', 2)}</IonLabel>
                  <IonToggle slot='start'checked={calefaccion} onIonChange={e => setCalefaccion(e.detail.checked)} />
                </IonItem>
                <IonItem>
                  <IonLabel>Microondas: {JSON.stringify(microondas? 'Si':'No').split('"', 2)}</IonLabel>
                  <IonToggle slot='start'checked={microondas} onIonChange={e => setMicroondas(e.detail.checked)} />
                </IonItem>
                <IonItem>
                  <IonLabel>Certificado Energético: {JSON.stringify(certificadoElectrico? 'Si':'No').split('"', 2)}</IonLabel>
                  <IonToggle slot='start'checked={certificadoElectrico} onIonChange={e => setCertificadoElectrico(e.detail.checked)} />
                </IonItem>
               { certificadoElectrico? <IonList>
                  <IonItem>
                    <IonLabel>  Escala eficiencia consumo</IonLabel>
                    <IonSelect value={eficienciaConsumo} okText="Okay" cancelText="Dismiss" onIonChange={e => setEficienciaConsumo(e.detail.value)}>
                      <IonSelectOption value="A">A</IonSelectOption>
                      <IonSelectOption value="B">B</IonSelectOption>
                      <IonSelectOption value="C">C</IonSelectOption>
                      <IonSelectOption value="D">D</IonSelectOption>
                      <IonSelectOption value="E">E</IonSelectOption>
                      <IonSelectOption value="F">F</IonSelectOption>
                      <IonSelectOption value="G">G</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput value={consumo}
                        placeholder="Valor eficiencia consumo"
                        onIonChange={ e => setConsumo(e.detail.value!) }
                    ></IonInput><p>kW h/ m<sup>2</sup>año</p>                    
                </IonItem>
                <IonItem>
                    <IonLabel>  Escala eficiencia emisiones</IonLabel>
                    <IonSelect value={eficienciaEmisiones} okText="Okay" cancelText="Dismiss" onIonChange={e => setEficienciaEmisiones(e.detail.value)}>
                    <IonSelectOption value="A">A</IonSelectOption>
                      <IonSelectOption value="B">B</IonSelectOption>
                      <IonSelectOption value="C">C</IonSelectOption>
                      <IonSelectOption value="D">D</IonSelectOption>
                      <IonSelectOption value="E">E</IonSelectOption>
                      <IonSelectOption value="F">F</IonSelectOption>
                      <IonSelectOption value="G">G</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput value={emisiones}
                        placeholder="Valor eficiencia emisiones"
                        onIonChange={ e => setEmisiones(e.detail.value!) }
                    ></IonInput><p>kg CO<sub>2</sub>m<sup>2</sup>/año</p>                    
                </IonItem>
                </IonList>:'' }    
                { alojamiento=='estudiantes'? <IonList>
                  <IonItem>
                    <IonLabel>  Escala eficiencia consumo</IonLabel>
                    <IonSelect value={eficienciaConsumo} okText="Okay" cancelText="Dismiss" onIonChange={e => setEficienciaConsumo(e.detail.value)}>
                      <IonSelectOption value="A">A</IonSelectOption>
                      <IonSelectOption value="B">B</IonSelectOption>
                      <IonSelectOption value="C">C</IonSelectOption>
                      <IonSelectOption value="D">D</IonSelectOption>
                      <IonSelectOption value="E">E</IonSelectOption>
                      <IonSelectOption value="F">F</IonSelectOption>
                      <IonSelectOption value="G">G</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput value={consumo}
                        placeholder="Valor eficiencia consumo"
                        onIonChange={ e => setConsumo(e.detail.value!) }
                    ></IonInput><p>kW h/ m<sup>2</sup>año</p>                    
                </IonItem>
                <IonItem>
                    <IonLabel>  Escala eficiencia emisiones</IonLabel>
                    <IonSelect value={eficienciaEmisiones} okText="Okay" cancelText="Dismiss" onIonChange={e => setEficienciaEmisiones(e.detail.value)}>
                    <IonSelectOption value="A">A</IonSelectOption>
                      <IonSelectOption value="B">B</IonSelectOption>
                      <IonSelectOption value="C">C</IonSelectOption>
                      <IonSelectOption value="D">D</IonSelectOption>
                      <IonSelectOption value="E">E</IonSelectOption>
                      <IonSelectOption value="F">F</IonSelectOption>
                      <IonSelectOption value="G">G</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem>
                    <IonInput value={emisiones}
                        placeholder="Valor eficiencia emisiones"
                        onIonChange={ e => setEmisiones(e.detail.value!) }
                    ></IonInput><p>kg CO<sub>2</sub>m<sup>2</sup>/año</p>                    
                </IonItem>
                </IonList>:'' }           
                <IonItemDivider>Ubicación</IonItemDivider>
                <IonItem>
                    <IonInput value={direccion}
                      placeholder="Dirección"
                      onIonChange={ e => setDireccion(e.detail.value!) }>                    
                    </IonInput>
                </IonItem>
                <IonItem>
                    <IonInput value={localidad}
                      placeholder="Localidad"
                      onIonChange={ e => setLocalidad(e.detail.value!) }>                    
                    </IonInput>
                </IonItem>
                <IonItem>
                    <IonInput value={provincia}
                      placeholder="Provincia"
                      onIonChange={ e => setProvincia(e.detail.value!) }>                    
                    </IonInput>
                </IonItem>
                <IonItem>
                    <IonInput value={codigoPostal}
                      placeholder="Codigo postal"
                      onIonChange={ e => setCodigoPostal(e.detail.value!) }>                    
                    </IonInput>
                </IonItem>
                
                <IonItem>
                  <IonButton color="primary" onClick={getLocation}>
                  <IonIcon icon={pin}  />
                   Obtener Localicación
                  </IonButton>
                </IonItem>
                <IonItemDivider>Imágenes</IonItemDivider>
                    <IonItem>
                    <IonChip>
                      <IonIcon icon={camera} color="primary" />
                      <IonLabel>Seleccione las imágenes</IonLabel>
                    </IonChip>
                    </IonItem>
                    <IonItem>
                  {url1 !='https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png'? 
                  <div className="subirFoto">
                  <IonImg onClick={() => setUrl1('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png')} src={url1} />
                  </div>:
                  <div className="subirFoto-boton">
                    <IonButton onClick={() => takePicture('foto1')}>
                      
                      <IonIcon icon={camera}></IonIcon>
                    </IonButton>
                    </div>}
                    {url2 !='https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png'? 
                  <div className="subirFoto">
                  <IonImg  onClick={() => setUrl2('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png')} src={url2} />
                  </div>:
                  <div className="subirFoto-boton">
                    <IonButton onClick={() => takePicture('foto2')}>
                      
                      <IonIcon icon={camera}></IonIcon>
                    </IonButton>
                    </div>}
                    {url3 !='https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png'? 
                  <div className="subirFoto">
                  <IonImg onClick={() => setUrl3('https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Antu_insert-image.svg/512px-Antu_insert-image.svg.png')} src={url3} />
                  </div>:
                  <div className="subirFoto-boton">
                    <IonButton onClick={() => takePicture('foto3')}>
                      
                      <IonIcon icon={camera}></IonIcon>
                    </IonButton>
                    </div>}
                  </IonItem>
                  <IonItem>
                    {/* get loading information from hook and display progress if necessary */}
                  {isLoading && progress && (
                    <IonProgressBar value={progress.value}></IonProgressBar>
                  )}
                  </IonItem> 
                      <IonButton color="success" expand="block"
                          onClick={() => crear() }>
                              <IonIcon icon={addOutline}>
                              </IonIcon>{existe?'Crear Anuncio':'Editar Anuncio'}</IonButton>
                      </IonCard>
                      <IonList> {
                          listaEquipo.map(anuncio => (
                              <IonCard key={anuncio.id}  /*href={'/pruebas2/' + anuncio.id}*/onClick={() => console.log('pepe')} >
                      <IonCardContent >
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
                          {
                            /*<IonItem>
                                <IonImg src={anuncio.url1}/*Poner un ? : para ver si hay imágen escondo el input y si no hay escondo la foto, hacer 4 variables de imágen y subirlas a la BD  />
                            </IonItem> 
                            <IonItem>
                                <IonImg src={anuncio.url2}/*Poner un ? : para ver si hay imágen escondo el input y si no hay escondo la foto, hacer 4 variables de imágen y subirlas a la BD  />
                            </IonItem> 
                            <IonItem>
                                <IonImg src={anuncio.url3}/*Poner un ? : para ver si hay imágen escondo el input y si no hay escondo la foto, hacer 4 variables de imágen y subirlas a la BD  />
                            </IonItem> */}
                            <IonCardTitle>Tipo de inmueble:
                            </IonCardTitle>
                            <IonCardTitle>{
                                anuncio.propiedad
                            }</IonCardTitle>

                           <p>Tipo de operación: {" "} { anuncio.alojamiento}</p>
                            <p>Precio: {anuncio.titulos} </p>
                <h4> <IonIcon icon={bedOutline} /> {anuncio.habitaciones} Hab. <IonIcon icon={waterSharp} /> {anuncio.banios} Baños   <IonIcon icon={cubeOutline} /> {anuncio.metros} M<sup>2</sup></h4>

                            <IonButton color="danger" expand="block"
                           onClick={() => eliminar(''+anuncio.id)}>
                         <IonIcon icon={trashBinOutline}></IonIcon>
                           Eliminar</IonButton>  
                    <IonButton color="tertiary" expand="block"
                     onClick={
                () => editar(''+anuncio.id,''+anuncio.propiedad,''+anuncio.titulos,''+anuncio.alojamiento,''+anuncio.direccion,''+anuncio.localidad,
                ''+anuncio.provincia,''+anuncio.codigoPostal,+anuncio.longitud,+anuncio.latitul,''+anuncio.url1,''+anuncio.url2,''+anuncio.url3,
                ''+anuncio.metros,''+anuncio.habitaciones,''+anuncio.banios,''+anuncio.planta,anuncio.ascensor,anuncio.aire,anuncio.calefaccion,
                anuncio.microondas,anuncio.certificadoElectrico,''+anuncio.eficienciaConsumo,''+anuncio.consumo,''+anuncio.eficienciaEmisiones,''+anuncio.emisiones,)}>
                         <IonIcon icon={pencil}></IonIcon>Editar</IonButton>   
                        </IonCardContent>
                         
                    </IonCard>
                )) }
             </IonList>
        </IonContent>
    </IonPage>
);
};
export default Anuncios;