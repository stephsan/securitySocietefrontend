import React, { useEffect, useState } from "react"
import api from "../../api/api"
import { showError } from "../../utils/notify"

const ListeValeur = () => {

  const [valeurs, setValeurs] = useState([])
  const [modalOpen, setModalOpen] = useState(false)

  const [parametres, setParametres] = useState([])

  const [selected, setSelected] = useState(null)

  const [formData, setFormData] = useState({
    libelle: "",
    parametre_id: "",
    valeur_id: ""
  })

  /* ===============================
     Chargement données
  =============================== */

  const chargerListe = async () => {
    try {
      const res = await api.get("/valeurs")
      setValeurs(res.data.data)

      const p = await api.get("/parametres")
      setParametres(p.data.data)

    } catch (e) {
      showError("Erreur serveur")
    }
  }

  useEffect(() => {
    chargerListe()
  }, [])

  /* ===============================
     Gestion formulaire
  =============================== */

  const openModal = (valeur = null) => {

    if (valeur) {
      setSelected(valeur)
      setFormData({
        libelle: valeur.libelle,
        parametre_id: valeur.parametre?.id || "",
        valeur_id: valeur.parent?.id || ""
      })
    } else {
      setSelected(null)
      setFormData({
        libelle: "",
        parametre_id: "",
        valeur_id: ""
      })
    }

    setModalOpen(true)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const saveValeur = async () => {

    try {

      if (selected) {
        await api.put(`/valeurs/${selected.id}`, formData)
      } else {
        await api.post("/valeurs", formData)
      }

      setModalOpen(false)
      chargerListe()

    } catch (e) {
      showError("Erreur sauvegarde")
    }
  }

  const supprimerValeur = async (id) => {

    if (!window.confirm("Supprimer cette valeur ?")) return

    await api.delete(`/valeurs/${id}`)
    chargerListe()
  }

  /* ===============================
     UI
  =============================== */

  return (

    <div className="card p-4">

      <div className="d-flex justify-content-between mb-3">
        <h4>Liste des Valeurs</h4>

        <button className="btn btn-success"
          onClick={() => openModal()}>
          <i className="bi bi-plus-circle"></i> Ajouter
        </button>
      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Paramètre</th>
            <th>Libellé</th>
            <th>Valeur Parent</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {valeurs?.map((v, index) => (
            <tr key={v.id}>

              <td>{index + 1}</td>

              <td>{v.parametre?.libelle || "-"}</td>

              <td>{v.libelle}</td>

              <td>{v.parent?.libelle || "-"}</td>

              <td className="text-center">

                <button
                  className="btn btn-sm btn-primary me-2"
                  onClick={() => openModal(v)}>
                  <i className="bi bi-pencil"></i>
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => supprimerValeur(v.id)}>
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

            <div className="modal-content p-4">

              <h5>
                {selected ? "Modifier Valeur" : "Ajouter Valeur"}
              </h5>

              {/* Parametre */}
              <div className="mb-3">
                <label>Paramètre</label>

                <select
                  className="form-select"
                  name="parametre_id"
                  value={formData.parametre_id}
                  onChange={handleChange}
                >
                  <option value="">Choisir paramètre</option>

                  {parametres.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.libelle}
                    </option>
                  ))}

                </select>
              </div>

              {/* Libelle */}
              <div className="mb-3">
                <label>Libellé</label>

                <input
                  className="form-control"
                  name="libelle"
                  value={formData.libelle}
                  onChange={handleChange}
                />
              </div>

              {/* Parent valeur */}
              <div className="mb-3">
                <label>Valeur Parent</label>

                <select
                  className="form-select"
                  name="valeur_id"
                  value={formData.valeur_id}
                  onChange={handleChange}
                >
                  <option value="">Aucun parent</option>

                  {valeurs.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.libelle}
                    </option>
                  ))}

                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">

                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}>
                  Annuler
                </button>

                <button
                  className="btn btn-success"
                  onClick={saveValeur}>
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

export default ListeValeur