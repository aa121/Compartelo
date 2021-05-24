import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonProgressBar,
    IonToast,
  } from "@ionic/react";
  import { camera, close } from "ionicons/icons";
  import React, { useState,useCallback,useContext, useEffect } from "react";
  import  firebase from "firebase/app";
  import { UserContext,db} from ".."
  //import { AnuncioContext} from "./Anuncios"

  import { CameraResultType } from "@capacitor/core";
  import { useCamera, availableFeatures } from "@ionic/react-hooks/camera";
  //Formato del archivo a subir a FB
  type DataAsDataUrl = { dataUrl: string; format: string };


  const Pruebas2: React.FC = () => {
  //Para guardar en BD
  const [alertText, setAlertText] = useState('');
  const onDidDismiss = useCallback(() => setAlertText(''), []);
  const user = useContext(UserContext);
  //const idAnuncio = useContext(AnuncioContext);

  // camera hook!!
  const { photo, getPhoto } = useCamera();
  const [url, setUrl] = useState('');
 
console.log('a')
    
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
    let fName = `${new Date().getTime()}.${v.format}`;
    // setting the firebase properties for the file upload
    //console.log(v.dataUrl);
    console.log(pho);
    var mountainsRef = storageRef.child(fName);
    var mountainImagesRef = storageRef.child('images2/' + fName);
    return mountainImagesRef.putString(v.dataUrl, "data_url");
    setTimeout(console.log,5000);
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
          setUrl(downloadUrl);
          console.log(downloadUrl);
          // set the data when upload has completed
        }
      );
    } catch (_error) {
        console.log("error subiendo imágen");
    } 
    console.log('oopp');
          console.log(url);

  };

  //Vamos a subir la foto a firebase
  const onSaveClick  = useCallback(() => {
    try{
      db.collection('users')
      .doc(user?.id) 
      .update({ photo: url,})
      .then(() => setAlertText("Cambiado correcatamente"))
      .catch((err) => setAlertText(err.message));
    }catch(_error){
        console.log("Error: " + _error); 
    }
    }, [photo,user]);

  // Cada vez que se suba una foto se actualiza
  useEffect(() => {
    uploadData();
  }, [photo]);


      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Ionic React Starter</IonTitle>
              </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                
                <IonButton onClick={() => takePicture()}>
                  <IonIcon icon={camera}></IonIcon>
                </IonButton>
                  <IonButton ion-button onClick={() => onSaveClick()}>
                    Guardar
                  </IonButton>
              </IonContent>
          <IonContent className="ion-padding">
            {photo ? (
              <div>
                <pre>{JSON.stringify(photo, null, 2)}</pre>
                <IonCard>
                  <img src={photo.dataUrl || photo.webPath} />
                </IonCard>
              </div>
            ) : null}
          </IonContent>
  
        </IonPage>
      );
    };
  
  export default Pruebas2;
  