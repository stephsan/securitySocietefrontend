import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import { showError, successMessage } from '../../utils/notify'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from 'react-toastify';

const ListeParametres = () => {

  const [parametres, setParametres] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedParam, setSelectedParam] = useState(null)
  const [libelle, setLibelle] = useState("")
  const [parametre_id, setparametre_id] = useState("")

  const recupererListe = async () => {
    try {
      const res = await api.get("/parametres")
      setParametres(res.data.data)
    } catch (e) {
      showError("Problème serveur")
    }
  }

  useEffect(() => {
    recupererListe()
  }, [])

  const openModal = (param = null) => {
    setSelectedParam(param)
    setLibelle(param ? param.libelle : "")
    setparametre_id(param ? param.parametre_id : "")
    setModalOpen(true)
  }

  const saveParametre = async () => {
    try {

      if (selectedParam) {
        await api.put(`/parametres/${selectedParam.id}`, {
          libelle,
          parametre_id
        })
        successMessage("Modification éffectuée avec success");
      } else {
        await api.post("/parametres", {
          libelle,
          parametre_id
        })
        successMessage("Modification éffectuée avec success");
      }

      setModalOpen(false)
      recupererListe()

    } catch (e) {
      showError("Erreur enregistrement")
    }
  }

  const supprimerParametre = async (id) => {
    if (!window.confirm("Supprimer ce paramètre ?")) return
    await api.delete(`/parametres/${id}`)
    recupererListe()
  }

  return (
    <div className="card p-4">

      <div className="d-flex justify-content-between mb-3">
        <h4>Liste des Paramètres</h4>
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
            <th>Libellé</th>
            <th>Parent</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {parametres?.map((param, index) => (
            <tr key={param.id}>
              <td>{index + 1}</td>
              <td>{param.libelle}</td>
              <td>{param.parent?.libelle || "-"}</td>
              <td className="text-center">
                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => openModal(param)}
                >
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => supprimerParametre(param.id)}
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
                <label>Libellé</label>
                <input
                  className="form-control"
                  value={libelle}
                  onChange={(e) => setLibelle(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label>Paramètre Parent</label>

                <select
                  className="form-select"
                  value={parametre_id}
                  onChange={(e) => setparametre_id(e.target.value)}
                >
                  <option value="">Aucun parent</option>

                  {parametres.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.libelle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">

                <button className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}>
                  Annuler
                </button>

                <button className="btn btn-success"
                  onClick={saveParametre}>
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

export default ListeParametres