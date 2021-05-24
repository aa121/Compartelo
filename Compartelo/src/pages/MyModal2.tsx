import {
  IonModal,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonList,
  IonSlide,
  IonSlides,
  IonContent,
  IonPage,
  IonInput,
  IonLabel,
  IonAvatar,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons
} from '@ionic/react';
import { arrowBack,reload } from 'ionicons/icons';
import { bedOutline, waterSharp, cubeOutline, addOutline } from 'ionicons/icons';
import React, { useContext,useCallback, useEffect, useState } from 'react';
import {db, UserContext} from ".."
import Chat from './Chat';
import firebase from 'firebase';
import { privateEncrypt } from 'crypto';
import { Plugins } from '@capacitor/core';
import { AES256 } from '@ionic-native/aes-256';

//Modal para desplegar el chat 

interface messages{ 
  emisor:string,
  createdAt:string,
  texto:string,
  idAnuncio:string,
  imagen:string,

}

export const MyModal2: React.FunctionComponent<any> = ({ variables, isOpen, onClose }) => {
    const user = useContext(UserContext);
    const [mensajes, setMensajes] = useState<messages[]>([]);

    //Texto del mensaje
    const [texto, setTexto] = useState('');    
    const onTextChange = useCallback((e) => setTexto(e.detail?.value), []);

    //Encriptacion 
    const [password, setPassword] = useState<string>('12345')
    const [secureKey, setSecureKey] = useState<string>('')
    const [secureIV, setSecuryIV] = useState<string>('')
    const [data, setData] = useState<string>('')
    const [encryptedData, setEncrpytedData] = useState<string>('')
    const [decryptedData, setDecryptedData] = useState<string>('')

    const enviar = async () => {
      //encrypt();
        console.log('Estoy');
        const emisor = variables.emisor;
        const idAnuncio = variables.name;
        console.log('Estoy2');

        console.log(idAnuncio);
        try {
            
            await db.collection('messages').add(
            {texto,createdAt: firebase.firestore.FieldValue.serverTimestamp(),emisor: user?.id,idAnuncio:variables.name,imagen:user?.photo});
          
              
        } catch (error) {
          console.log('Error creando enviando mensaje')
        }
        //Una vez creado restablecemos los valores a vacíos
        setTexto('');
        listar();  
    }

    const listar = async () => {
      try {
        let lista: messages[] = [];
        const res = await db.collection('messages')
        .where("idAnuncio", "==", variables.name)
        .get(); 
        console.log("e");
        console.log(res);

      res.forEach((doc) => {
        //decrypt();
        let obj = {
          createdAt: doc.data().createdAt.toString(),
          emisor: doc.data().emisor,
          //texto: decryptedData,
          texto: doc.data().texto,
          idAnuncio: doc.data().idAnuncio,
          imagen: doc.data().imagen,

        };
        lista.push(obj);  
        });
        setMensajes(lista);
        //setMensajes(mensajes.sort());

        
    } catch (error) {
      console.log('Error listando*********** ');
    }
    };
    mensajes.sort(function (a, b) {
      return a.createdAt.localeCompare(b.createdAt);
  });
    /*
    const listar = async () => {
      try {
        let lista: chat[] = [];
        const res = await db.collection('chat').get(); 
      res.forEach((doc) => {
        if(doc.data().idAnuncio == variables.name){
          let obj = {
              idUsuario: doc.data().idUsuario,
              createdAt: doc.data().createdAt,
              idAnuncio: doc.data().idAnuncio,
              idAnunciante: doc.data().idAnunciante,
            };
            
            setChat(obj);
          }
  
        });
        
    } catch (error) {
      console.log('Error listando*********** ');
    }
    };*/
    
    //Encriptacion
    /*const secureKey = '123';
    const secureIV = '123';
    const a = new AES256();
    a.encrypt(secureKey,secureIV,'123')
 console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
 console.log(a);*/

 //Generamos los credenciales de seguirdad
 const generateSecureKeyAndIV = async () => {
  setSecureKey(await AES256.generateSecureKey(password))
  setSecuryIV(await AES256.generateSecureIV(password))
}

//Encriptamos con los credenciales generados los mensajes envíados 
const encrypt = async () => {

  AES256.encrypt(secureKey, secureIV, texto)
    .then(res => {
      setEncrpytedData(res);
    })
    .catch(error => alert(error))
}
//Desencriptamos con los credenciales generados los mensajes recibidos 

const decrypt = () => {

  AES256.decrypt(secureKey, secureIV, encryptedData)
    .then(res => setDecryptedData(res))
    .catch(error => alert(error))
}

      useEffect(() => {
        generateSecureKeyAndIV();
        console.log('e');
        listar();
      },[isOpen]);  

      //LISTAR CONTINUAMENTE EN TIEMPO REAL LOS MENSAJES
      /*
      useEffect(() => {
        listar();
      },);  */

      
      /* //Darle la vuelta al array para que se muestren en otrden? 
          Hacer   : const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
          Para saber si el mensaje es enviado por el creador del chat o por el anunciante  */

      return (

    <IonModal isOpen={isOpen}>

      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Chat</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
            <IonIcon slot="start" icon={arrowBack}/>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
          <IonButton onClick={()=>listar()}>
          <IonIcon slot="start" icon={reload}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonList>
        
      {mensajes.map((mensajes) => (
        <IonItem>
        
      {user?.id==mensajes.emisor?
      <IonItem>
      <IonAvatar slot="start">
        {/* Si soy yo el que manda elmensaje lo muestro a la derecha y si lo recibo lo muestro a la izquierda*/}
        <img src={mensajes.imagen}></img>
      </IonAvatar>        
      <p> {mensajes?.texto} </p>
        </IonItem>
        :
        <IonItem>
        <IonAvatar slot="start">
          {/* Si soy yo el que manda elmensaje lo muestro a la derecha y si lo recibo lo muestro a la izquierda*/}
          <img src={mensajes.imagen}></img>
      </IonAvatar>        
      <p> {mensajes?.texto} </p>
        </IonItem>
          /* *Fin de condicion */}
            

          </IonItem>

            
          ))} 
          </IonList>

          <IonItem>
          <IonLabel >Mensaje:</IonLabel>
          <IonInput onIonChange={(e) => setTexto(e.detail.value!)} value={texto}/>
        </IonItem>
        <IonButton color="success" expand="block"
                          onClick={() => enviar() }>
                              <IonIcon icon={addOutline}>
                              </IonIcon>{'Enviar'}
        </IonButton>

      </IonContent>

    </IonModal>
  );
};
export default MyModal2;
