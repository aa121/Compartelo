import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';import { IonReactRouter } from '@ionic/react-router';
import { create,search,heart } from 'ionicons/icons';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import ForgotPassword from './pages/ForgotPassword';
import Anuncios from './pages/Anuncios';
import Buscar from './pages/Buscar';
import Pruebas2 from './pages/Pruebas2';
import GeolocationButton from './pages/GeolocationButton';
import Favoritos from './pages/Favoritos';
import Chat from './pages/Chat';
import EditarPerfil from './pages/Editar-Perfil';
import BuscarInteligente from './pages/Buscar-Inteligente';






/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import React, { useContext } from 'react';
import { UserContext } from './';


const App: React.FC = () => (
  
  <IonApp>
    <IonReactRouter>
    <IonTabs>
    <IonRouterOutlet>
      <Route path="/" render={() => <Redirect to="/anuncios" />} exact={true} />
      <Route component={Home} path="/home" />
      <Route component={Login} exact={true} path="/login" />
      <Route component={Perfil} exact={true} path="/perfil" />
      <Route component={Register} exact={true} path="/register"/>
      <Route component={ForgotPassword} exact={true} path="/forgotpassword"/>
      <Route component={Anuncios} exact={true} path="/anuncios"/>
      <Route component={Buscar} exact={true} path="/buscar"/>
      <Route component={Pruebas2} exact={true} path="/pruebas2"/>
      <Route component={Favoritos} exact={true} path="/favoritos"/>
      <Route component={Chat} exact={true} path="/chat"/>
      <Route component={EditarPerfil} exact={true} path="/editar-perfil"/>
      <Route component={BuscarInteligente} exact={true} path="/buscar-inteligente"/>

      <Route path="/GeolocationButton" component={GeolocationButton} exact={true} />
      </IonRouterOutlet>

  <IonTabBar slot="bottom">
        <IonTabButton tab="buscar" href="/buscar">
          <IonIcon icon={search} />
          <IonLabel>Explorar</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favoritos" href="/favoritos">
          <IonIcon icon={heart} />
          <IonLabel>Favoritos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="anuncios" href="/anuncios">
          <IonIcon icon={create} />
          <IonLabel>Crear</IonLabel>
        </IonTabButton>
        <IonTabButton tab="perfil" href="/perfil">
          <IonIcon icon={create} />
          <IonLabel>Perfil </IonLabel>
        </IonTabButton>
        <IonTabButton tab="login" href="/login">
          <IonIcon icon={create} />
          <IonLabel>Login </IonLabel>
        </IonTabButton>
      </IonTabBar>
      </IonTabs>
  </IonReactRouter>
</IonApp>
);

export default App;
/*
const PublicRoutes = () => {
  return (
    <IonReactRouter>
      <Route component={Login} exact={true} path="/" />
      <Route component={Register} exact={true} path="/register"/>
      <Route path="/" render={() => <Redirect to="/" />} />
    </IonReactRouter>
  );
};
const PrivateRoutes = () => {
  return (
    <IonReactRouter>
      <Route component={Home} path="/" />
      <Route path="/" render={() => <Redirect to="/" />} />
    </IonReactRouter>
  );
};


const App: React.FC = () => {
  const user = useContext(UserContext);
  console.log({user})
  //Si he inicado sesión accedo a una vista y si no a otra 
  return(
    <IonApp>
        {user ? <PrivateRoutes/> : <PublicRoutes/>}
      </IonApp>
  );
};

export default App;


const App: React.FC = () => {
  const user = useContext(UserContext);

  return(
    <IonApp>
      {user ? (
      <IonReactRouter>
      <IonRouterOutlet>
        <Route component={Home} exact path="/" />
        <Redirect to="/"/>
      </IonRouterOutlet>
    </IonReactRouter>
      
      )
      :(
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/register" component={Register} exact={true} />
          <Route exact path="/" component={Login} />
          <Redirect to="/"/>
        </IonRouterOutlet>
      </IonReactRouter>
      )};
    </IonApp>
  );
};


const App: React.FC = () => {
  const user = null;

  return(
    <IonApp>
      {user ? (<Home/>)
      :(
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" component={Home} exact={true} />
          <Route path="/login" component={Login} exact={true} />
          <Route path="/register" component={Register} exact={true} />
          <Route exact path="/" render={() => <Redirect to="/home" />} /> 
        </IonRouterOutlet>
      </IonReactRouter>
      )};
    </IonApp>
  );
};*/ 