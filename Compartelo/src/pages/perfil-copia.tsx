import { IonAlert, IonButton, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import {auth, db, UserContext} from ".."
import { Redirect, useHistory } from 'react-router';
import { camera, close } from "ionicons/icons";
import  firebase from "firebase/app";

import { CameraResultType } from "@capacitor/core";
import { useCamera, availableFeatures } from "@ionic/react-hooks/camera";
  //Formato del archivo a subir a FB
  type DataAsDataUrl = { dataUrl: string };

const Profile: FC = () => {  
  const user = useContext(UserContext);
  const history = useHistory();
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');

  const [alertText, setAlertText] = useState('');

  const onDidDismiss = useCallback(() => setAlertText(''), []);

    // camera hook!!
    const { photo, getPhoto } = useCamera();
    const [url, setUrl] = useState('');

 


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
const setUp = (pho:typeof photo) => {

  var storageRef = firebase.storage().ref();

    let v = pho as DataAsDataUrl;
    let fName = `${new Date().getTime()}.png`;
    // setting the firebase properties for the file upload
    //console.log(v.dataUrl);
    console.log(pho);
    var mountainsRef = storageRef.child(fName);
    var mountainImagesRef = storageRef.child('images2/' + fName);
    return mountainImagesRef.putString(v.dataUrl, "data_url");
  }


  const uploadData = async () => {
    
    
    // wrap the whole thing in a try catch block to update the error state
    try {
      let uploadTask = setUp(photo);
    
      // tracking the state of the upload to assist in updating the
      // application UI
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        
        async () => {
          // need to get the url to download the file
          let downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
          //me guardo la URL
          setUrl( await downloadUrl);
    console.log('77777777777777');    
          console.log(downloadUrl);
          //setUrl(downloadUrl);

          // set the data when upload has completed
        }
      );
    } catch (_error) {
        console.log("error subiendo imágen: " + _error);
    } 

  };
  useEffect(() => {
    if(!user) history.push('/login');
    else{
      if(photo!=undefined){
        uploadData();
      }
      setDisplayName(user.displayName ?? '')
      setAge(user.age?.toString() ?? '') 
      setAge(user.age?.toString() ?? '')
      setUrl(user.photo?.toString() ?? '')
      console.log('asd');
    }
  },[photo])

  const onDipslayNameChange = useCallback((e) => setDisplayName(e.detail?.value), []);
  const onAgeChange = useCallback((e) => setAge(e.detail?.value), []);


  const onSaveClick  = useCallback(() => {
    //uploadData();
    console.log("BDBDBDB");
    console.log(url);
    db.collection('users')
    .doc(user?.id)
    .update({ age: Number(age), displayName,photo: url,})
    .then(() => setAlertText("Cambiado correcatamente"))
    .catch((err) => setAlertText(err.message));
    }, [age, displayName,user,photo]);




  return(

  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonItem>
          <IonLabel>Nombre de ususario:</IonLabel>
          <IonInput onIonChange={onDipslayNameChange}
          value={displayName}/>
        </IonItem>
        <IonItem>
          <IonLabel>Edad:</IonLabel>
          <IonInput onIonChange={onAgeChange}
            type = "number"
          value={age}/>
        </IonItem>
        <IonItem>
        <IonImg src={url} />
        </IonItem> 
        <IonItem>
        <IonButton onClick={() => takePicture()}>
                  <IonIcon icon={camera}></IonIcon>
                </IonButton>
        </IonItem>
        < IonButton color="primary" 
          onClick={onSaveClick}
          >
            Guardar</IonButton>
          < IonButton color="secondary" routerLink="/">Volver</IonButton>
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
