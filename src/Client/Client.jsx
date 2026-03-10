import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import api from '../api/api';
import { showError, successMessage } from '../utils/notify';
import { useNavigate } from 'react-router-dom';

const Client = () => {
    const navigate=useNavigate();
    const [clients, setClients] = useState([])
    const [listeRegimeDimposition, setListeRegimeDimposition] = useState([])
    const [listeDivisionFiscales, setListeDivisionFiscales] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedParam, setSelectedParam] = useState(null)
    const [denomination, setDenomination] = useState("")
    const [regimeDimposition, setRegimeDimposition] = useState("")
    const [divisionFiscale, setDivisionFiscale] = useState("")
    const [telephone, setTelephone] = useState("")
    const [email, setEmail] = useState("")
    const [detail_adresse, setDetailsAdresse] = useState("")
    const [code_client, setCodeClient] = useState("")
    const [client_id, setClient_id] = useState("")
    const [telephoneMobile, setTelephoneMobile] = useState("")
    const [numeroRccm, setNumeroRccm] = useState("")
    const [numeroIfu, setNumeroIfu] = useState("")
    const [section, setSection] = useState("")
    const [boitePostale, setboitePostale] = useState("")

    //lister les clients 
    const recupererListe = async () => {
        try {
          const res = await api.get("/clients")
          setClients(res.data.data)
        } catch (e) {
          showError("Problème serveur")
        }
      }
//Ajouter un client 
const saveClient = async () => {
    try {
      if (selectedParam) {
        await api.put(`/clients/${selectedParam.id}`, {
            denomination,
            telephone,
            email,
            detail_adresse,
            numeroRccm,
            telephoneMobile,
            numeroIfu,
            section,
            divisionFiscale,
            regimeDimposition,
            boitePostale
        })
        successMessage("Création éffectuée avec success");
      } else {
        await api.post("/clients", {
            denomination,
            telephone,
            email,
            boitePostale,
            detail_adresse,
            numeroRccm,
            telephoneMobile,
            numeroIfu,
            section,
            divisionFiscale,
            regimeDimposition,
        })
        successMessage("Modification éffectuée avec success");
      }

      setModalOpen(false)
      recupererListe()

    } catch (e) {
      showError("Erreur enregistrement")
    }
  }
  const supprimerClient = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return
    await api.delete(`/clients/${id}`)
    recupererListe()
  }
  //Liste des regimes fiscals 

  const fetchRegimesFiscales = async()=>{
    try{
      const res = await api.get("/return-valeur/9");
      setListeRegimeDimposition(res.data.data || res.data);
    }catch(e){
      showError("Erreur chargement fonctions");
    }
   }
   const fetchDivisionFiscales = async()=>{
    try{
      const res = await api.get("/return-valeur/10");
      setListeDivisionFiscales(res.data.data || res.data);
    }catch(e){
      showError("Erreur chargement fonctions");
    }
   }
    useEffect(() => {
        recupererListe();
        fetchRegimesFiscales();
        fetchDivisionFiscales();

    }, [])
    const openModal = (client = null) => {
        setSelectedParam(client)
        setDenomination(client ? client.denomination : "")
        setTelephone(client ? client.telephone : "")
        setTelephoneMobile(client ? client.telephone_mobile : "")
        setboitePostale(client ? client.boite_postale : "")

        setEmail(client ? client.email : "")
        setCodeClient(client ? client.code_client : "")
        setNumeroRccm(client ? client.numero_rccm : "")
        setNumeroIfu(client ? client.numero_ifu : "")
        setDivisionFiscale(client ? client.division_fiscale : "")
        setRegimeDimposition(client ? client.regime_fiscal : "")
        setDetailsAdresse(client ? client.detail_adresse : "")
        setSection(client ? client.section : "")

        setClient_id(client ? client.id : "")
        setModalOpen(true)
      }
  return (
    <div className="card p-4">
    <div className="d-flex justify-content-between mb-3">
      <h4>Liste des Clients</h4>
      <button className="btn btn-success"
        onClick={() => openModal()}>
        <i className="bi bi-plus-circle"></i> Ajouter
      </button>
    </div>
    {/* TABLE */}
    <table className="table table-bordered table-hover">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Code Client</th>
          <th>Dénomination</th>
          <th>Télephone</th>
          <th>Email</th>
          <th>Adresse</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients?.map((client, index) => (
          <tr key={client.id}>
            <td>{index + 1}</td>
            <td>{client.code_client || "-"}</td>
            <td>{client.denomination}</td>
            <td>{client.telephone || "-"}</td>
            <td>{client.email || "-"}</td>
            <td>{client.detail_adresse || "-"}</td>
            <td className="text-center">
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => openModal(client)}
              >
                <i className="bi bi-pencil"></i>
              </button>

              <button 
              className="btn btn-sm btn-warning me-2"
              onClick={() => navigate(`/client/${client.id}`)}
              >
              <i className="bi bi-eye"></i>
            </button>

              <button
                className="btn btn-sm btn-danger me-2"
                onClick={() => supprimerClient(client.id)}
              >
                <i className="bi bi-trash"></i>
              </button>

            

            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* ================= MODAL ================= */}
    {modalOpen && (
      <div className="modal fade show d-block bg-dark bg-opacity-50">
        <div className="modal-dialog  modal-xl">
          <div className="modal-content p-3">

            <h5>
              {selectedParam ? "Modifier Client" : "Ajouter Client"}
            </h5>
            <div className="col-md-10 mb-3">
              <label>Dénomination</label>
              <input
                className="form-control"
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label>Numéro RCCM</label>
                <input
                  className="form-control"
                  value={numeroRccm}
                  onChange={(e) => setNumeroRccm(e.target.value)}
                  required
                />
              </div>
                <div className="col-md-6 mb-3">
                <label>Numéro IFU</label>
                <input
                  className="form-control"
                  value={numeroIfu}
                  onChange={(e) => setNumeroIfu(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
            <div className="col-md-6 mb-3">
                <label>Division Fiscale</label>
                <select
                  className="form-select"
                  value={divisionFiscale}
                  onChange={(e) => setDivisionFiscale(e.target.value)}
                  required
                >
                    <option value="">Choisir la division fiscale</option>
                  {listeDivisionFiscales.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label>Regime d'imposition</label>
                <select
                  className="form-select"
                  value={regimeDimposition}
                  onChange={(e) => setRegimeDimposition(e.target.value)}
                  required
                >
                    <option value="">Choisir le regime d'imposition</option>
                  {listeRegimeDimposition.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.libelle}
                    </option>
                  ))}
                  
                </select>
            </div>
            </div>
            <div className="col-md-11 mb-3">
              <label>Section</label>
              <input
                className="form-control"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Télephone fixe</label>
                <input
                  className="form-control"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
                <div className="col-md-4 mb-3">
                <label>Télephone Mobile</label>
                <input
                  className="form-control"
                  value={telephoneMobile}
                  onChange={(e) => setTelephoneMobile(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label>Email</label>
                <input
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label>Adresse detaillée</label>
                <input
                  className="form-control"
                  value={detail_adresse}
                  onChange={(e) => setDetailsAdresse(e.target.value)}
                  required
                />
              </div>
                <div className="col-md-4 mb-3">
                <label>Boite Postale</label>
                <input
                  className="form-control"
                  value={boitePostale}
                  onChange={(e) => setboitePostale(e.target.value)}
                />
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2">

              <button className="btn btn-secondary"
                onClick={() => setModalOpen(false)}>
                Annuler
              </button>

              <button className="btn btn-success"
                onClick={saveClient}>
                Sauvegarder
              </button>

            </div>

          </div>
        </div>
      </div>
    )}

  </div>
  )
}

export default Client