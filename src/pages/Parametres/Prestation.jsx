import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import { showError, successMessage } from '../../utils/notify'

const Prestation = () => {
    const [prestations, setPrestations] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
  const [selectedParam, setSelectedParam] = useState(null)
  const [nature_prestation, setNaturePrestation] = useState("")
  const [description_prestation, setDescriptionPrestation] = useState("")
  const [montant_min_prestation, setMontantMinPrestation] = useState("")
  const [prestation_id, setprestation_id] = useState("")
  const [listeNaturePrestation,setListeNaturePrestation]=useState([]);

    const recupererListe = async () => {
        try {
          const res = await api.get("/prestations")
          console.log(res.data.data)
          setPrestations(res.data.data)
        } catch (e) {
          showError("Problème serveur")
        }
      }
    
      
      const openModal = (prestation = null) => {
        setSelectedParam(prestation)
        setDescriptionPrestation(prestation ? prestation.description_prestation : "")
        setNaturePrestation(prestation ? prestation.nature_prestation : "")
        setMontantMinPrestation(prestation ? prestation.montant_min_prestation : "")
        
        setModalOpen(true)
      }

      // Lister deroulant de la nature des prestations
      const fetchNaturePrestation = async()=>{
        try{
          const res = await api.get("/return-valeur/8");
          setListeNaturePrestation(res.data.data || res.data);
        }catch(e){
          showError("Erreur chargement fonctions");
        }
       }
      const savePrestation = async () => {
        try {
    
          if (selectedParam) {
            await api.put(`/prestations/${selectedParam.id}`, {
                description_prestation,
                nature_prestation,
                montant_min_prestation,
            })
            successMessage("Modification éffectuée avec success");
          } else {
            await api.post("/prestations", {
                description_prestation,
                nature_prestation,
                montant_min_prestation,
            })
            successMessage("Ajout éffectuée avec success");
          }
    
          setModalOpen(false)
          recupererListe()
    
        } catch (e) {
          showError("Erreur enregistrement")
        }
      }
      const supprimerPrestation = async (id) => {
        if (!window.confirm("Supprimer la prestation ?")) return
        await api.delete(`/prestations/${id}`)
        recupererListe()
      }
      useEffect(() => {
        fetchNaturePrestation()
        recupererListe()
      }, [])
  return (
    <div className="card p-4">

      <div className="d-flex justify-content-between mb-3">
        <h4>Liste des prestations</h4>
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
            <th>Nature de la prestation</th>
            <th>Montant minimum</th>
            <th>Description de la prestation</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prestations?.map((prestation, index) => (
            <tr key={prestation.id}>
              <td>{index + 1}</td>
              <td>{prestation.nature}</td>
              <td>{prestation.montant_min_prestation || "-"}</td>
              <td>{prestation.description_prestation || "-"}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => openModal(prestation)}
                >
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => supprimerPrestation(prestation.id)}
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
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>
                {selectedParam ? "Modifier Paramètre" : "Ajouter Paramètre"}
              </h5>
              <div className="mb-3">
                <label>Nature Prestation</label>
                <select
                  className="form-select"
                  value={nature_prestation}
                  onChange={(e) => setNaturePrestation(e.target.value)}
                >
                    <option value="">Choisir la nature</option>
                  {listeNaturePrestation.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label>Montant minimum</label>
                <input
                  className="form-control"
                  value={montant_min_prestation}
                  onChange={(e) => setMontantMinPrestation(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label>Breve description</label>
                <input
                  className="form-control"
                  value={description_prestation}
                  onChange={(e) => setDescriptionPrestation(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">

                <button className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}>
                  Annuler
                </button>

                <button className="btn btn-success"
                  onClick={savePrestation}>
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

export default Prestation