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
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonFab
} from '@ionic/react';
import { bedOutline, waterSharp, cubeOutline, arrowBack, reload, heart, heartOutline, contractOutline, contract, chatboxSharp } from 'ionicons/icons';
import React, { useContext, useEffect, useState } from 'react';
import {db, UserContext} from ".."
import Chat from './Chat';
import firebase from 'firebase';

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

export const MyModal: React.FunctionComponent<any> = ({ variables, isOpen, onClose }) => {
    const user = useContext(UserContext);
    const [mensaje, setMensaje] = useState(false);
    const [anuncio, setListaEquipo] = useState<anuncio>();
    const [existe, setExiste] = useState(false);
    const [existeFavoritos, setExisteFavoritos] = useState(false);
    const [idAnunciante, setIdAnunciante] = useState('');


    
    const listar = async () => {
        try {
          console.log()
          const res = await db
            .collection("anuncio")
            .get();
          res.forEach((doc) => {

              if(doc.id == variables.name){
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

              ascensor:  doc.data().ascensor,
              aire: doc.data().aire,
              calefaccion: doc.data().calefaccion,
              microondas: doc.data().microondas,
              certificadoElectrico: doc.data().certificadoElectrico,
              eficienciaConsumo: doc.data().eficienciaConsumo,
              consumo: doc.data().consumo,
              eficienciaEmisiones: doc.data().eficienciaEmisiones,
              emisiones: doc.data().emisiones,
            };
            //Me guardo el usuario creador del anuncio
            setIdAnunciante(doc.data().idUsuario);
            setListaEquipo(obj);
        }
    
        
          });
        } catch (error) {}
      };
          //Crear una tabla con las salas y de cada sala un chat? o simpllmenteo una salla donde esté el chat y fuera y con el idAnuncio puedo listar las conversaciones? 0 0.         
          //Vamos a crear en la bd una tabla con el ID usuario, ID del usuario del propietario del Anuncio y un array de anuncios favoritos
    const contactar = async (idAnuncio:string) => {
      try {
        var createdAt = new Date().toLocaleString();

        //En vez de esto paso como parámetro el id del anuncio en el que de click ç
        //Y lo meto en la BD como favorito
        //var anuncios = [idAnuncio];

          const idUsuarioActual = user?.id;
          const idAnuncio = variables.name;
          const nombre = user?.displayName;
          const imagen = user?.photo;


          //Si no existe lo creo
           if(!existe){
            console.log('No existe chat');
            await db.collection('chat').add(
            {idUsuarioActual,createdAt,idAnuncio,idAnunciante,nombre,imagen });
            setExiste(true);
          }else{//Si existe el anuncio lo modifi con set()
            console.log('Ya existe chat');
          }
 
      } catch (error) {}
      //Una vez creado restablecemos los valores a vacíos
      
  }
  const favoritos = async () => {
    try {

      //En vez de esto paso como parámetro el id del anuncio en el que de click ç
      //Y lo meto en la BD como favorito
      //var anuncios = [idAnuncio];

        const idUsuarioActual = user?.id;
        const idAnuncio = variables.name;


        //Si no existe lo creo
         //if(!existeFavoritos){
          console.log('No existe chat');
          await db.collection('favoritos').add(
          {idUsuarioActual,idAnuncio });
          setExisteFavoritos(true);
      /*  }else{//Si existe en favoritos no lo muestro
          console.log('Ya existe chat');
        }*/

    } catch (error) {}
    //Una vez creado restablecemos los valores a vacíos
    
}
const eliminar = async(id:string|undefined) =>{
  try {
      console.log(id)
      const res = await db
      .collection("favoritos")
      .where("idUsuarioActual", "==", id)
      .get();
    res.forEach((doc) => {
      eliminar2(doc.data().idAnuncio);
        console.log( doc.data().idUsuarioActual);
        console.log('09090909909');
    });
    setExisteFavoritos(false);

  } catch (error) {}       
}

const eliminar2 = async(id:string) =>{
  try {
      console.log(id)
      await db.collection('favoritos').doc(id)
      .delete();
      listar();  
  } catch (error) {}       
}

    //Lista continuamente
     /* useEffect(() => {
        listar();
      },);  
      */

      useEffect(() => {
        listar();
      },);  
      /*Poner contactar y algun detalle más, ver como hacer más grande la ventanan  */
      return (
    <IonModal isOpen={isOpen}>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Anuncio</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>
            <IonIcon slot="start" icon={arrowBack}/>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
        <IonContent>

            <IonCard   
              key={anuncio?.id} 
              
            >
              <IonCardContent>

                <IonItem>
                  <IonSlides id="slides">
                    <IonSlide>
                      <img src={anuncio?.url1} />
                    </IonSlide>
                    <IonSlide>
                      <img src={anuncio?.url2} />
                    </IonSlide>
                    <IonSlide>
                      <img src={anuncio?.url3} />
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
                 <p><br></br></p>
                 <h2>{anuncio?.titulos} € </h2>
                 <p>{anuncio?.direccion}, {anuncio?.localidad} {anuncio?.provincia} {anuncio?.codigoPostal}</p>
                 <p><br></br></p>

                <p>Tipo de propiedad: {anuncio?.propiedad}</p>
                <p>Tipo de alojamiento: {anuncio?.alojamiento}</p>
                <p><br></br></p>

                <h4> <IonIcon icon={bedOutline} /> {anuncio?.habitaciones} Hab. <IonIcon icon={waterSharp} /> {anuncio?.banios} Baños    <IonIcon icon={cubeOutline} /> {anuncio?.metros} M<sup>2</sup></h4>
                <p>Caracteristicas:</p>
                <p><li>Ascensor:{anuncio?.ascensor ? ' Si': ' No'}</li></p>
                <p><li>Aire acondicionado:{anuncio?.aire ? ' Si': ' No'}</li></p>
                <p><li>Calefaccion:{anuncio?.calefaccion ? ' Si': ' No'}</li></p>
                <p><li>Microondas:{anuncio?.microondas ? ' Si': ' No'}</li></p>
                <p><br></br></p>
                {anuncio?.eficienciaEmisiones != ''?
                <p>Eficiencia:</p>:''}
                {anuncio?.eficienciaEmisiones != ''? 
                <p><li>Emisiones: {anuncio?.eficienciaEmisiones} {anuncio?.emisiones}kg CO<sub>2</sub>m<sup>2</sup>/año</li></p>: ''}
                {anuncio?.eficienciaConsumo != ''? 
                <p><li>Consumo: {anuncio?.eficienciaConsumo} {anuncio?.emisiones}kW h/ m<sup>2</sup>año</li></p>: ''}
      

                <IonButton routerLink="/chat" onClick={() => contactar('a')} ><IonIcon  icon={chatboxSharp}/></IonButton>
                {existeFavoritos?
                <IonButton color="danger" routerLink="/favoritos" onClick={() => eliminar(anuncio?.id)} ><IonIcon icon={heart}/></IonButton>:
                <IonButton color="danger" routerLink="/favoritos" onClick={() =>favoritos() } ><IonIcon  icon={heartOutline}/></IonButton>
                          //Sustituir en un futuro por algo mejor (hacer con el css con lo de abajo https://ionicframework.com/docs/api/fab (Lo de abajo)

                }
                {existeFavoritos?
                <IonFab horizontal="end" vertical="top" slot="fixed" onClick={() => eliminar(anuncio?.id)}>
                  <IonButtons color="danger">
                    <IonButton color="danger" routerLink="/favoritos" /*onClick={() =>favoritos() } */><IonIcon  icon={heartOutline}/></IonButton>
                  </IonButtons>
                </IonFab>
              :
                <IonFab horizontal="end" vertical="top" slot="fixed" onClick={() =>favoritos() }>
                  <IonButtons color="danger">
                    <IonButton color="danger" routerLink="/favoritos" /*onClick={() => eliminar(anuncio?.id)}*/ ><IonIcon icon={heart}/></IonButton>
                  </IonButtons>
                </IonFab>                          //Sustituir en un futuro por algo mejor (hacer con el css con lo de abajo https://ionicframework.com/docs/api/fab)

                }
          
          
                  </IonCardContent>
            </IonCard>
            {/*<IonCard   
              key={anuncio?.id} 
              
            >
              <IonCardContent>

                <IonItem>
                  <IonSlides id="slides">
                    <IonSlide>
                      <img src={anuncio?.url1} />
                    </IonSlide>
                    <IonSlide>
                      <img src={anuncio?.url2} />
                    </IonSlide>
                    <IonSlide>
                      <img src={anuncio?.url3} />
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
                            </IonItem> }
                <IonCardTitle>Tipo de propiedad:</IonCardTitle>
                <IonCardTitle>{anuncio?.propiedad}</IonCardTitle>

                <p>Tipo de alojamiento: {anuncio?.alojamiento}</p>
                <p>{anuncio?.titulos} € </p>
                <h4> <IonIcon icon={bedOutline} /> {anuncio?.habitaciones} Hab. <IonIcon icon={waterSharp} /> {anuncio?.banios} Baños   <IonIcon icon={cubeOutline} /> {anuncio?.metros} M<sup>2</sup></h4>
              </IonCardContent>
            </IonCard>*/}
            
      </IonContent>

    </IonModal>
  );
};
export default MyModal;
