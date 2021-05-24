import { IonAlert, IonAvatar, IonButton, IonButtons, IonChip, IonContent, IonDatetime, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemGroup, IonLabel, IonList, IonPage, IonProgressBar, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {auth, db, UserContext} from ".."
import { Redirect, useHistory } from 'react-router';
import { arrowBack, camera, close, save } from "ionicons/icons";
import  firebase from "firebase/app";
import './perfil.css';

import { CameraResultType } from "@capacitor/core";
import { useCamera, availableFeatures } from "@ionic/react-hooks/camera";
  //Formato del archivo a subir a FB
  type DataAsDataUrl = { dataUrl: string; format: string };
  type UploadDataResponse =
  | { metaData: firebase.storage.FullMetadata; downloadUrl: any }
  | undefined;
type ProgressResponse = { value: number } | undefined | null;
type UploadSource = File | DataAsDataUrl | undefined;
                                                                                                        
const Profile: FC = () => {  
  
  const user = useContext(UserContext);
  const history = useHistory();
  const [displayName, setDisplayName] = useState('');
  const [telefono, setTelefono] = useState('');
  const [age, setAge] = useState('');

  const [alertText, setAlertText] = useState('');

  const onDidDismiss = useCallback(() => setAlertText(''), []);

  // camera hook!!
  const { photo, getPhoto } = useCamera();
  const [url, setUrl] = useState('');
  //Cosntantes para subir foto a FireBase
  // the data from the file upload response
  const [dataResponse, setDataResponse] = useState<UploadDataResponse>();

  // sets properties on the file to be uploaded
  const [fileData, setFileData] = useState<UploadSource>();

  // if we are loading a file or not
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // if an error happened during the process
  const [isError, setIsError] = useState<any>(false);

  // used for tracking the % of upload completed
  const [progress, setProgress] = useState<ProgressResponse>(null);
  var storageRef = firebase.storage().ref();
  const [dentro, setDentro] = useState(false);
//Fecha de naciomiento
const [selectedDate, setSelectedDate] = useState<string>('');
const [genero, setGenero] = useState('');
const [estudios, setEstudios] = useState('');
const [universidad, setUniversidad] = useState('');
const [ciudad, setCiudad] = useState('');
const [provincia, setProvincia] = useState('');


//Intereses
const [deportes, setDeportes] = useState(false);
const [viajar, setViajar] = useState(false);
const [futbol, setFutbol] = useState(false);
const [musica, setMusica] = useState(false);
const [netflix, setNetflix] = useState(false);
const [arte, setArte] = useState(false);
const [cine, setCine] = useState(false);
const [leer, setLeer] = useState(false);
const [gamer, setGamer] = useState(false);

const [snowboard, setSnowboard] = useState(false);
const [caminar, setCaminar] = useState(false);
const [animales, setAnimales] = useState(false);
const [surf, setSurf] = useState(false);
const [cantar, setCantar] = useState(false);
const [yoga, setYoga] = useState(false);
const [escalada, setEscalada] = useState(false);
const [idiomas, setIdiomas] = useState(false);
const [correr, setCorrer] = useState(false);
const [crossfit, setCrossfit] = useState(false);
const [acampada, setAcampada] = useState(false);
const [fotografia, setFotografia] = useState(false);
const [vegano, setVegano] = useState(false);
const [comedia, setComedia] = useState(false);
const [gym, setGym] = useState(false);
const [eSports, setESports] = useState(false);
const [disney, setDisney] = useState(false);
const [ciclismo, setCiclismo] = useState(false);
const [festivales, setFestivales] = useState(false);
const [bailar, setBailar] = useState(false);
const [instagram, setInstagram] = useState(false);

//FB
//Subimos el archivo
const takePicture = () => {
  if (availableFeatures.getPhoto) {
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

  const uploadData = async () => {
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
          setUrl(downloadUrl);
          console.log('estoy generando url');
          console.log(url)
          console.log(downloadUrl)
          try{
            db.collection('users')
            .doc(user?.id)
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
  if( dentro == false){
    if(!user) history.push('/login');
    setDentro(true);
  }  

  useEffect(() => {
    if(!user) history.push('/login');
    //Si se ha subido imágen la subo a Firebase
    else{
      if(photo!=undefined){
        uploadData();
      }//Si photo es null es decir al cargar la pantalla, cargo los datos sólo una vez (si lo dejo fuera se actualizar cada vez que subo una foto pero claro si modificas nombre y subes foto se va e nombre a no se de que pirmero nombre y luego foto )
      else{
        setDisplayName(user.displayName ?? '')
        setSelectedDate(user.selectedDate ?? '')
        setUrl(user.photo?.toString() ?? '')
        setGenero(user.genero ?? '')
        setTelefono(user.telefono ?? '')
        setEstudios(user.estudios ?? '')
        setUniversidad(user.universidad ?? '')
        setCiudad(user.ciudad ?? '')
        setProvincia(user.provincia ?? '')
        setDeportes(user.deportes ?? false)
        setViajar(user.viajar ?? false)
        setFutbol(user.futbol ?? false)
        setMusica(user.musica ?? false)
        setNetflix(user.netflix ?? false)
        setArte(user.arte ?? false)
        setCine(user.cine ?? false)
        setLeer(user.leer ?? false)
        setGamer(user.gamer ?? false)
        
        setSnowboard(user.snowboard ?? false)
        setCaminar(user.caminar ?? false)
        setAnimales(user.animales ?? false)
        setSurf(user.surf ?? false)
        setCantar(user.cantar ?? false)
        setYoga(user.yoga ?? false)
        setEscalada(user.escalada ?? false)
        setIdiomas(user.idiomas ?? false)
        setCorrer(user.correr ?? false)
        setCrossfit(user.crossfit ?? false)
        setAcampada(user.acampada ?? false)
        setFotografia(user.fotografia ?? false)
        setVegano(user.vegano ?? false)
        setComedia(user.comedia ?? false)
        setGym(user.gym ?? false)
        setESports(user.eSports ?? false)
        setDisney(user.disney ?? false)
        setCiclismo(user.ciclismo ?? false)
        setFestivales(user.festivales ?? false)
        setBailar(user.bailar ?? false)
        setInstagram(user.instagram ?? false)

       
      }
      }
  },[photo,])
  useEffect(() => {
    if(!user) history.push('/login');
  },[])

  const onDipslayNameChange = useCallback((e) => setDisplayName(e.detail?.value), []);
  const onDipslayTelefonoChange = useCallback((e) => setTelefono(e.detail?.value), []);

  const onAgeChange = useCallback((e) => setAge(e.detail?.value), []);

//Actualizamos la bd
  const onSaveClick  = useCallback(async () => {
    db.collection('users')
    .doc(user?.id)
    .update({ selectedDate, displayName, genero, telefono, estudios, universidad, ciudad, provincia, deportes, viajar, 
      futbol, musica, netflix, arte, cine, leer, gamer,  snowboard, caminar, animales, surf, cantar, yoga, escalada, idiomas,
      correr, crossfit, acampada, fotografia, vegano,  comedia, gym, eSports, disney, ciclismo, festivales, bailar, instagram})
    .then(() => setAlertText("Cambiado correcatamente"))
    .catch((err) => setAlertText(err.message));
    }, [selectedDate, displayName,user,photo,genero, telefono, estudios, universidad, ciudad,provincia,deportes, viajar,
      futbol, musica, netflix, arte, cine, leer, gamer,  snowboard, caminar, animales, surf, cantar, yoga, escalada, idiomas,
      correr, crossfit, acampada, fotografia, vegano,  comedia, gym, eSports, disney, ciclismo, festivales, bailar, instagram]);




  return(

  <IonPage>
      <IonToolbar>
          <IonTitle>Perfil</IonTitle>
          <IonButtons slot="start">
            <IonButton routerLink="/perfil">
            <IonIcon slot="start" icon={arrowBack}/>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton  onClick={onSaveClick}>
          <IonIcon slot="start" icon={save}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
    <IonContent>

      <IonList>
      {isLoading && progress && (
          <IonProgressBar value={progress.value}></IonProgressBar>
        )}
        <IonAvatar className="centrar-foto" onClick={() => takePicture()}>
        <img src={url}/>
        </IonAvatar>
        {/*<IonItem >
        {isLoading && progress && (
          <IonProgressBar value={progress.value}></IonProgressBar>
        )}
        <IonButton onClick={() => takePicture()}>
                  <IonIcon icon={camera}></IonIcon>
                </IonButton>
        </IonItem>*/
}
        <IonItem>
          <IonLabel>Nombre:</IonLabel>
          <IonInput onIonChange={onDipslayNameChange}
          value={displayName}/>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Fecha de nacimiento</IonLabel>
          <IonDatetime doneText="Añadir" cancelText="Cancelar" displayFormat="MM/DD/YYYY" min="1800-01-01" max="2100-12-09" value={selectedDate} onIonChange={e => setSelectedDate(e.detail.value!)}></IonDatetime>
        </IonItem>
        <IonItem>
          <IonLabel>Género</IonLabel>
            <IonSelect value={genero} okText="Añadir" cancelText="Cancelar" onIonChange={e => setGenero(e.detail.value)}>
              <IonSelectOption value="Hombre">Hombre</IonSelectOption>
              <IonSelectOption value="Mujer">Mujer</IonSelectOption>
              <IonSelectOption value="Otro">Otro</IonSelectOption>
            </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel>Teléfono:</IonLabel>
          <IonInput onIonChange={onDipslayTelefonoChange}
          value={telefono}/>
        </IonItem>


        <IonItem>
          <IonLabel>Estudios</IonLabel>
            <IonSelect value={estudios} okText="Añadir" cancelText="Cancelar" onIonChange={e => setEstudios(e.detail.value)}>
              <IonSelectOption value="GRADO EN ARQUITECTURA">GRADO EN ARQUITECTURA</IonSelectOption>
              <IonSelectOption value="GRADO EN ADMINISTRACIÓN Y DIRECCIÓN DE EMPRESAS">GRADO EN ADMINISTRACIÓN Y DIRECCIÓN DE EMPRESAS</IonSelectOption>
              <IonSelectOption value="GRADO EN BIOLOGÍA">GRADO EN BIOLOGÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN CIENCIAS DEL MAR">GRADO EN CIENCIAS DEL MAR</IonSelectOption>
              <IonSelectOption value="GRADO EN CRIMINOLOGÍA">GRADO EN CRIMINOLOGÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN DERECHO">GRADO EN DERECHO</IonSelectOption>
              <IonSelectOption value="GRADO EN ECONOMÍA">GRADO EN ECONOMÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN ENFERMERÍA">GRADO EN ENFERMERÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN ESPAÑOL">GRADO EN ESPAÑOL</IonSelectOption>
              <IonSelectOption value="GRADO EN ESTUDIOS ÁRABES E ISLÁMICOS">GRADO EN ESTUDIOS ÁRABES E ISLÁMICOS</IonSelectOption>
              <IonSelectOption value="GRADO EN ESTUDIOS FRANCESES">GRADO EN ESTUDIOS FRANCESES</IonSelectOption>
              <IonSelectOption value="GRADO EN ESTUDIOS INGLESES">GRADO EN ESTUDIOS INGLESES</IonSelectOption>
              <IonSelectOption value="GRADO EN FÍSICA">GRADO EN FÍSICA</IonSelectOption>
              <IonSelectOption value="GRADO EN GASTRONOMÍA Y ARTES CULINARIAS">GRADO EN GASTRONOMÍA Y ARTES CULINARIAS</IonSelectOption>
              <IonSelectOption value="GRADO EN GEOGRAFÍA">GRADO EN GEOGRAFÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN GEOLOGÍA">GRADO EN GEOLOGÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN HISTORIA">GRADO EN HISTORIA</IonSelectOption>
              <IonSelectOption value="GRADO EN HUMANIDADES">GRADO EN HUMANIDADES</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA BIOMÉDICA">GRADO EN INGENIERÍA BIOMÉDICA</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA CIVIL">GRADO EN INGENIERÍA CIVIL</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA EN SONIDO E IMAGEN EN TELECOMUNICACIÓN">GRADO EN INGENIERÍA EN SONIDO E IMAGEN EN TELECOMUNICACIÓN</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA INFORMÁTICA">GRADO EN INGENIERÍA INFORMÁTICA</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA MULTIMEDIA">GRADO EN INGENIERÍA MULTIMEDIA</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA QUÍMICA">GRADO EN INGENIERÍA QUÍMICA</IonSelectOption>
              <IonSelectOption value="GRADO EN INGENIERÍA ROBÓTICA">GRADO EN INGENIERÍA ROBÓTICA</IonSelectOption>
              <IonSelectOption value="GRADO EN MAESTRO EN EDUCACIÓN INFANTIL">GRADO EN MAESTRO EN EDUCACIÓN INFANTIL</IonSelectOption>
              <IonSelectOption value="GRADO EN MATEMÁTICAS">GRADO EN MATEMÁTICAS</IonSelectOption>
              <IonSelectOption value="GRADO EN MARKETING">GRADO EN MARKETING</IonSelectOption>
              <IonSelectOption value="GRADO EN QUÍMICA">GRADO EN QUÍMICA</IonSelectOption>
              <IonSelectOption value="GRADO EN SOCIOLOGÍA">GRADO EN SOCIOLOGÍA</IonSelectOption>
              <IonSelectOption value="GRADO EN TRABAJO SOCIAL">GRADO EN TRABAJO SOCIAL</IonSelectOption>
              <IonSelectOption value="GRADO EN TURISMO ">GRADO EN TURISMO </IonSelectOption>
              <IonSelectOption value="MÁSTER EN FERTILIDAD HUMANA">MÁSTER EN FERTILIDAD HUMANA</IonSelectOption>
              <IonSelectOption value="MÁSTER EN PATRIMONIO VIRTUAL">MÁSTER EN PATRIMONIO VIRTUAL</IonSelectOption>
              <IonSelectOption value="MÁSTER EN PATRIMONIO VIRTUAL">MÁSTER EN PATRIMONIO VIRTUAL</IonSelectOption>
              <IonSelectOption value="MÁSTER EN TRIBUTACIÓN">MÁSTER EN TRIBUTACIÓN</IonSelectOption>
              <IonSelectOption value="MÁSTER UNIVERSITARIO EN AUTOMÁTICA Y ROBÓTICA">MÁSTER UNIVERSITARIO EN AUTOMÁTICA Y ROBÓTICA</IonSelectOption>
              <IonSelectOption value=" DOBLE GRADO"> DOBLE GRADO</IonSelectOption>
              <IonSelectOption value="Otro">Otro</IonSelectOption>
            </IonSelect>
        </IonItem>   
        <IonItem>
          <IonLabel>Estudios:</IonLabel>

          <IonInput onIonChange={useCallback((e) => setEstudios(e.detail?.value), [])}
          value={estudios}/>
        </IonItem>
        <IonItem>
          <IonLabel>Universidad:</IonLabel>

          <IonInput onIonChange={useCallback((e) => setUniversidad(e.detail?.value), [])}
          value={universidad}/>
        </IonItem>
        <IonItem>
          <IonLabel>Ciudad:</IonLabel>
          <IonInput onIonChange={useCallback((e) => setCiudad(e.detail?.value), [])}
          value={ciudad}/>
        </IonItem>
        <IonItem>
          <IonLabel>Provincia:</IonLabel>
          <IonInput onIonChange={useCallback((e) => setProvincia(e.detail?.value), [])}
          value={provincia}/>
        </IonItem>

        <IonItem>
          <IonLabel>Intereses</IonLabel>
        </IonItem>
        <IonItemGroup>
        {deportes? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setDeportes(false)}>Deportes</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setDeportes(true)}>Deportes</IonLabel>
          </IonChip>
          }
          {viajar? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setViajar(false)}>Viajar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setViajar(true)}>Viajar</IonLabel>
          </IonChip>
          }
          {futbol? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setFutbol(false)}>Fútbol</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setFutbol(true)}>Fútbol</IonLabel>
          </IonChip>
          }
          {musica? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setMusica(false)}>Música</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setMusica(true)}>Música</IonLabel>
          </IonChip>
          }
          {netflix? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setNetflix(false)}>Netflix</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setNetflix(true)}>Netflix</IonLabel>
          </IonChip>
          }
          {arte? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setArte(false)}>Arte</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setArte(true)}>Arte</IonLabel>
          </IonChip>
          }
          {cine? 
        //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setCine(false)}>Cine</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setCine(true)}>Cine</IonLabel>
          </IonChip>
          }
          {leer? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setLeer(false)}>Leer</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setLeer(true)}>Leer</IonLabel>
          </IonChip>
          }

          {gamer? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setGamer(false)}>Gamer</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setGamer(true)}>Gamer</IonLabel>
          </IonChip>
          }




          
          {snowboard? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setSnowboard(false)}>Snowboard</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setSnowboard(true)}>Snowboard</IonLabel>
          </IonChip>
          }
          {caminar? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setCaminar(false)}>Caminar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setCaminar(true)}>Caminar</IonLabel>
          </IonChip>
          }
          {animales? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setAnimales(false)}>Animales</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setAnimales(true)}>Animales</IonLabel>
          </IonChip>
          }
          {surf? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setSurf(false)}>Surf</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setSurf(true)}>Surf</IonLabel>
          </IonChip>
          }
          {cantar? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setCantar(false)}>Cantar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setCantar(true)}>Cantar</IonLabel>
          </IonChip>
          }
          {yoga? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setYoga(false)}>Yoga</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setYoga(true)}>Yoga</IonLabel>
          </IonChip>
          }
          {escalada? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setEscalada(false)}>Escalada</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setEscalada(true)}>Escalada</IonLabel>
          </IonChip>
          }
          {idiomas? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setIdiomas(false)}>Idiomas</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setIdiomas(true)}>Idiomas</IonLabel>
          </IonChip>
          }
          {correr? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setCorrer(false)}>Correr</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setCorrer(true)}>Correr</IonLabel>
          </IonChip>
          }
          {crossfit? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setCrossfit(false)}>Crossfit</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setCrossfit(true)}>Crossfit</IonLabel>
          </IonChip>
          }
          {acampada? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setAcampada(false)}>Acampada</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setAcampada(true)}>Acampada</IonLabel>
          </IonChip>
          }
          {fotografia? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setFotografia(false)}>Fotografia</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setFotografia(true)}>Fotografia</IonLabel>
          </IonChip>
          }
          {vegano? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setVegano(false)}>Vegan</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setVegano(true)}>Vegan</IonLabel>
          </IonChip>
          }
          {comedia? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setComedia(false)}>Comedia</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setComedia(true)}>Comedia</IonLabel>
          </IonChip>
          }
          {gym? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setGym(false)}>Gym</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setGym(true)}>Gym</IonLabel>
          </IonChip>
          }
          {eSports? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setESports(false)}>eSports</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setESports(true)}>eSports</IonLabel>
          </IonChip>
          }
          {disney? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setDisney(false)}>Disney</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setDisney(true)}>Disney</IonLabel>
          </IonChip>
          }
          {ciclismo? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setCiclismo(false)}>Ciclismo</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setCiclismo(true)}>Ciclismo</IonLabel>
          </IonChip>
          }
          {festivales? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setFestivales(false)}>Festivales</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setFestivales(true)}>Festivales</IonLabel>
          </IonChip>
          }
          {bailar? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setBailar(false)}>Bailar</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setBailar(true)}>Bailar</IonLabel>
          </IonChip>
          }
          {instagram? 
          //Si me gusta deporte sale en verde .....
          <IonChip className="centrar-chip" color="danger">
            <IonLabel className="centrar-chip-label" onClick={() => setInstagram(false)}>Instagram</IonLabel>
          </IonChip>
          :
          <IonChip className="centrar-chip" color="primary">
            <IonLabel className="centrar-chip-label" onClick={() => setInstagram(true)}>Instagram</IonLabel>
          </IonChip>
          }
          
        
      
      </IonItemGroup>

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
