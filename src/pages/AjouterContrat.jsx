import React, { useEffect, useState } from 'react'
import { showError, successMessage } from '../utils/notify';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const AjouterContrat = () => {
    const navigate=useNavigate();
    const [prestations,setPrestations]=useState([])
    const [clients,setClients]=useState([])
    const [newFile, setNewFile] = useState(null);

    const [contrat, setContrat] = useState({
        client_id: "",
        clause_particulieres: "",
        lignes: [
          { type_prestation: "", quantite: 1, montant: 0 }
        ]
      });
    //ajouter ligne de contrat
      const addLigne = () => {
        setContrat({
          ...contrat,
          lignes: [
            ...contrat.lignes,
            { type_prestation: "", quantite: 1, montant: 0 }
          ]
        });
      };
      //modifier ligne de contrat
      const handleLigneChange = (index, field, value) => {
        const newLignes = [...contrat.lignes];
        newLignes[index][field] = value;
    
        // Si on choisit prestation → remplir montant auto
        if (field === "prestation_id") {
          const prestation = prestations.find(p => p.id == value);
          if (prestation) {
            newLignes[index].montant_min = prestation.montant_min_prestation;
            newLignes[index].montant = prestation.montant_min_prestation; 
          }
        }
        if (field === "montant" || field === "quantite") {
            const montant = parseFloat(newLignes[index].montant) || 0;
            const quantite = parseFloat(newLignes[index].quantite) || 0;
            newLignes[index].montant_prestation = montant * quantite;
          }
        //   if (field === "montant") {
        //     const montantMin = newLignes[index].montant_min;
        //     if (parseFloat(value) < parseFloat(montantMin)) {
        //       showError("Le montant ne peut pas être inférieur au montant minimum");
        //       newLignes[index].montant = montantMin;
        //     }
        // }
    
        setContrat({ ...contrat, lignes: newLignes });
      };
//supprimer ligne de contrat
const removeLigne = (index) => {
    const newLignes = contrat.lignes.filter((_, i) => i !== index);
    setContrat({ ...contrat, lignes: newLignes });
  };
// Si on choisit prestation → remplir montant minimum auto
//lister les prestations
const fetchPrestations = async()=>{
    try{
      const res = await api.get("/prestations");
      setPrestations(res.data.data || res.data);
    }catch(e){
      showError("Erreur chargement des prestations");
    }
   }

   const fetchClients = async()=>{
    try{
        const res = await api.get("/clients")
        setClients(res.data.data)
      console.log(res)
    }catch(e){
      showError("Erreur chargement des clients");
    }
   }

      const handleSubmit = async (e) => {
        e.preventDefault();
      console.log(JSON.stringify(contrat));
        try {
          const formData = new FormData();
          formData.append("client_id", contrat.client_id);
          formData.append("clause_particulieres", contrat.clause_particulieres || "");

          // Lignes de contrat (tableau)
          formData.append("lignes", JSON.stringify(contrat.lignes));
          contrat.lignes.forEach((ligne, index) => {
            formData.append(`lignes[${index}][prestation_id]`, ligne.prestation_id);
            formData.append(`lignes[${index}][quantite]`, ligne.quantite);
            formData.append(`lignes[${index}][montant]`, ligne.montant);
            formData.append(`lignes[${index}][montant_prestation]`, ligne.montant_prestation);
          });

          // Fichier
          if (newFile) {
            formData.append("contract_file", newFile);
          }
            await api.post("/contrats/", formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                    }
                });

              // await api.post(`/contrats/${id}?_method=PUT`, formData, {
              //   headers: {
              //     "Content-Type": "multipart/form-data",
              //   },
              // });
        //   const response = await fetch("http://localhost:8000/api/contrats", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(contrat),
        //   });
      
        successMessage("Création éffectuée avec success");
        navigate('/lister-contrat');
        } catch (error) {
          console.error(error);
        }
      };
 // 🔹 Total
 const total = contrat.lignes.reduce(
    (sum, ligne) => sum + (ligne.quantite * ligne.montant),
    0
  );
      useEffect(()=>{
        fetchClients()
        fetchPrestations()
      },[]);
  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Ajouter un Contrat</h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label className="form-label">Joindre une copie du contrat</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setNewFile(e.target.files[0])}
              />
            </div>
            {/* Client */}
            <div className="mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                value={contrat.client_id}
                onChange={(e) =>
                  setContrat({ ...contrat, client_id: e.target.value })
                }
                required
              >
                <option value="">-- Sélectionner un client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.denomination}
                  </option>
                ))}
              </select>
            </div>

            {/* Clauses */}
            <div className="mb-3">
              <label className="form-label">Clauses particulières</label>
              <textarea
                className="form-control"
                rows="3"
                value={contrat.clause_particulieres}
                onChange={(e) =>
                  setContrat({ ...contrat, clause_particulieres: e.target.value })
                }
              />
            </div>

            <hr />

            <h6>Lignes du contrat</h6>

            {contrat.lignes.map((ligne, index) => (
              <div key={index} className="row align-items-end mb-3">

                <div className="col-md-3">
                  <label className="form-label">Prestation</label>
                  <select
                    className="form-select"
                    value={ligne.prestation_id}
                    onChange={(e) =>
                      handleLigneChange(index, "prestation_id", e.target.value)
                    }
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {prestations.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nature}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label">Montant minimum</label>
                    <input
                        type="number"
                        className="form-control"
                        value={ligne.montant_min}
                        disabled
                    />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Quantité</label>
                  <input
                    type="number"
                    className="form-control"
                    value={ligne.quantite}
                    onChange={(e) =>
                      handleLigneChange(index, "quantite", e.target.value)
                    }
                    min="1"
                  />
                </div>

                <div className="col-md-2">
                <label className="form-label">Montant</label>
                <input
                    type="number"
                    className="form-control"
                    value={ligne.montant}
                    min={ligne.montant_min}
                    onChange={(e) =>
                    handleLigneChange(index, "montant", e.target.value)
                    }
                    onBlur={(e) => {
                        if (parseFloat(ligne.montant) < parseFloat(ligne.montant_min)) {
                        showError("Le montant doit être supérieur au montant minimum");
                        handleLigneChange(index, "montant", ligne.montant_min);
                        }
                    }}
                    required
                />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Montant prestation</label>
                    <input
                        type="number"
                        className="form-control"
                        value={ligne.montant_prestation}
                        min={ligne.montant_min}
                        onChange={(e) =>
                            handleLigneChange(index, "montant_prestation", e.target.value)
                        }
                       
                        disabled
                    />
                </div>

                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeLigne(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={addLigne}
            >
              + Ajouter ligne
            </button>

            <div className="alert alert-info">
              <strong>Total :</strong> {total.toLocaleString()} FCFA
            </div>

            <button type="submit" className="btn btn-success w-100">
              Enregistrer le Contrat
            </button>

          </form>
        </div>
      </div>
    </div>
    
  )
}


export default AjouterContrat