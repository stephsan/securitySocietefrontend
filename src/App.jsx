
import './App.css';
import Dashboard from './pages/Dashboard';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import User from './pages/User';
import Layout from './pages/Layout';
import Personne from './pages/Personne';
import { ToastContainer } from 'react-toastify';
import ListePersone from './pages/ListePersone';
import { DetailPersone } from './pages/DetailsEmploye/DetailPersone';
import { EditEmployee } from './pages/EditEmployee';
import Auth from './pages/Authentification/Auth';
import ProtectedRoute from "./components/ProtectedRoute";
import ListeParametres from './pages/Parametres/ListeParametres';
import ListeValeur from './pages/Parametres/ListeValeur';
import Client from './Client/Client';
import DetailsClient from './Client/DetailsClient';
import Prestation from './pages/Parametres/Prestation';
import AjouterContrat from './pages/AjouterContrat';
import ListerContrat from './pages/ListerContrat';
import ModifierContrat from './pages/ModifierContrat';

function App() {
  return (<BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/create-personne" element={<Personne />} />
          <Route path="/liste-personne" element={<ListePersone />} />
          <Route path="/personne/:id" element={<DetailPersone />} />
          <Route path="/personne/edit/:id" element={<EditEmployee />} />
          <Route path="/create-user" element={<User />} />
          <Route path="/liste-parametre" element={<ListeParametres />} />
          <Route path="/liste-valeur" element={<ListeValeur />} />
          <Route path="/liste-clients" element={<Client/>} />
          <Route path="/client/:id" element={<DetailsClient />} />
          <Route path="/liste-prestation" element={<Prestation/>} />
          <Route path='/add-contrat' element={<AjouterContrat/>}/>
          <Route path='/lister-contrat' element={<ListerContrat/>}/>
          <Route path='/modifier-contrat/:id' element={<ModifierContrat/>}/>

        </Route>
      </Route>
    </Routes>
    {/* ajout de message flash ToastContainer*/}
    <ToastContainer />
  </BrowserRouter>  
    
  )
}

export default App
