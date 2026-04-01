import React, { useEffect, useState } from 'react'
import { showError, successMessage } from '../utils/notify';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const ModifierContrat = () => {
    const [prestations, setPrestations] = useState([]);
  const [clients, setClients] = useState([]);
  const [newFile, setNewFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [contrat, setContrat] = useState({
    client_id: "",
    clause_particulieres: "",
    lignes: []
  });
    useEffect(() => {
        fetchContrat();
        fetchPrestations();
       fetchClients();
      }, []);
    const fetchContrat = async () => {
        try {
          const res = await api.get(`/contrats/${id}`);
          setContrat(res.data);
        } catch (error) {
          showError("Erreur chargement contrat");
        }
      };
    
      const fetchPrestations = async () => {
        try {
          const res = await api.get("/prestations");
          setPrestations(res.data.data || res.data);
        } catch (error) {
          showError("Erreur chargement prestations");
        }
      };
      const fetchClients = async () => {
        try {
          const res = await api.get("/clients");
          setClients(res.data.data || res.data);
        } catch (error) {
          showError("Erreur chargement clients");
        }
      };
      const handleLigneChange = (index, field, value) => {
        const newLignes = [...contrat.lignes];
        newLignes[index][field] = value;
    
        if (field === "prestation_id") {
            const prestation = prestations.find(p => p.id == value);
            if (prestation) {
              newLignes[index].montant_min = prestation.montant_min_prestation;
              newLignes[index].montant = prestation.montant_min_prestation; 
            }
          }
        // Recalcul automatique
        if (field === "montant" || field === "quantite") {
          const montant = parseFloat(newLignes[index].montant) || 0;
          const quantite = parseFloat(newLignes[index].quantite) || 0;
          newLignes[index].montant_prestation = montant * quantite;
        }
    
        setContrat({ ...contrat, lignes: newLignes });
      };

      const addLigne = () => {
        setContrat({
          ...contrat,
          lignes: [
            ...contrat.lignes,
            {
              prestation_id: "",
              quantite: 1,
              montant: 0,
              montant_prestation: 0
            }
          ]
        });
      };
    
      const removeLigne = (index) => {
        const newLignes = contrat.lignes.filter((_, i) => i !== index);
        setContrat({ ...contrat, lignes: newLignes });
      };
      // ===============================
  // 🔹 TOTAL
  // ===============================

  const total = contrat.lignes.reduce(
    (sum, ligne) => sum + (ligne.montant_prestation || 0),
    0
  );

  // ===============================
  // 🔹 SUBMIT UPDATE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Champs simples
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
      await api.post(`/contrats/${id}?_method=PUT`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      successMessage("Contrat modifié avec succès");
      navigate("/lister-contrat");
    } catch (error) {
      showError("Erreur modification contrat");
    }
  };    
  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Modifier le Contrat</h5>
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
   
            {/* CLIENT */}
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
                <option value="">-- Sélectionner --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.denomination}
                  </option>
                ))}
              </select>
            </div>

            {/* CLAUSES */}
            <div className="mb-3">
              <label className="form-label">Clauses particulières</label>
              <textarea
                className="form-control"
                rows="3"
                value={contrat.clause_particulieres || ""}
                onChange={(e) =>
                  setContrat({
                    ...contrat,
                    clause_particulieres: e.target.value
                  })
                }
              />
            </div>

            <hr />
            <h6>Lignes du contrat</h6>
            {contrat.lignes.map((ligne, index) => (
              <div key={index} className="row align-items-end mb-3">
                {/* PRESTATION */}
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
                {/* QUANTITE */}
                <div className="col-md-2">
                  <label className="form-label">Quantité</label>
                  <input
                    type="number"
                    className="form-control"
                    value={ligne.quantite}
                    min="1"
                    onChange={(e) =>
                      handleLigneChange(index, "quantite", e.target.value)
                    }
                  />
                </div>
                {/* MONTANT */}
                <div className="col-md-2">
                  <label className="form-label">Montant</label>
                  <input
                    type="number"
                    className="form-control"
                    value={ligne.montant}
                    min="0"
                    onChange={(e) =>
                      handleLigneChange(index, "montant", e.target.value)
                    }
                    required
                  />
                </div>
                {/* MONTANT PRESTATION */}
                <div className="col-md-2">
                  <label className="form-label">Montant prestation</label>
                  <input
                    type="number"
                    className="form-control"
                    value={ligne.montant_prestation}
                    disabled
                  />
                </div>
                {/* DELETE */}
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeLigne(index)}
                  >
                    Supprimer
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
              <strong>Total :</strong>{" "}
              {total.toLocaleString()} FCFA
            </div>

            <button type="submit" className="btn btn-warning w-100">
              Mettre à jour le Contrat
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default ModifierContrat