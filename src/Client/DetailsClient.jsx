import React, { useEffect, useState } from 'react'
import styles from "../pages/DetailsEmploye/DetailsEmployee.module.css"
import api from '../api/api'
import { useParams } from 'react-router-dom';

const DetailsClient = () => {
    const { id } = useParams();
    const [client,setClient]=useState(null);
    const recupererClient= async() =>{
        try {
          const res= await api.get(`clients/${id}`)
          console.log(res.data.data)
          setClient(res.data.data)
        } catch (error) {
          console.error("Erreur API :", error);
        }
        }
        useEffect(()=>{ 
            recupererClient()
        },[id])
if (!client) {
    return <div>Chargement...</div>;
    }else{
  return (
    <div className={styles.page}>
    {/* Header */}
    <div className={styles.header}>
      <div className={styles.profile}>
      {/* <img className={styles.avatar} src={personne.image_url} alt={`${personne.nom} ${personne.prenom}`} /> */}

        <div>
          <h2 className={styles.name}>
            {client.denomination} 
          </h2>
          {/* <p className={styles.role}>{personne.poste}</p> */}
          <p className={styles.matricule}>
            Code Client : <strong>{client.code_client}</strong>
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnDanger}  >Supprimer</button>
        <button className={styles.btnSuccess} >Nouveau Site</button>
        {/* <button className={styles.btnSecondary} onClick={() => downloadCard(personne.id)}>
          Télécharger Carte
        </button> */}
      </div>
    </div>

    {/* Grid */}
    <div className={styles.grid}>

      {/* Infos générales */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Informations générales</h3>
        <ul className={styles.detailsList}>
          <li><span>Code Client</span><strong>{client.code_client}</strong></li>
          <li><span>Nom</span><strong>{client.denomination}</strong></li>
          <li><span>Télephone</span><strong>{client.telephone}</strong></li>
          <li><span>Email</span><strong>{client.email}</strong></li>
          <li><span>Details Adresse</span><strong>{client.detail_adresse}</strong></li>
        </ul>
      </div>

      {/* Historique */}
       <div className={styles.card}>
        <h3 className={styles.cardTitle}>Les Sites</h3>

        {/* <div className={styles.timeline}>
          {personne.fonctions_occupees?.map((item, index) => (
            <div key={index} className={styles.timelineItem}>
              <span className={styles.timelineDate}>{item.date_debut} au {item.date_fin}</span>
              <div className={styles.timelineContent}>
                <strong>{item.fonction_occupee}</strong>
              </div>
              <div className={styles.timelineContent}>
                <a onClick={() => supprimerFonction(item.fonction_occupee_id)}>
                  <i className="bi bi-trash"></i>
                </a>
              </div>
            </div>
          ))}
        </div> */}
      </div> 

      {/* Documents */}
       <div className={`${styles.card} ${styles.fullWidth}`}>
        <h3 className={styles.cardTitle}>Les factures</h3>

        {/* <table className={styles.documentsTable}>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Type document</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {personne.documents?.map((doc, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{doc.type_document}</td>
                <td>
                  <a href={doc.download_url} className="btn btn-sm btn-default">
                    <i className="bi bi-eye"></i>
                  </a>
                  <a  className="btn btn-sm btn-primary me-2" onClick={() => openModal(doc)}>
                    <i className="bi bi-pencil"></i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </div> 

    </div>
{/* {modalOpen && (

<div className="modal fade show d-block bg-dark bg-opacity-50">

<div className="modal-dialog">

  <div className="modal-content p-4">

  <h3>Modifier le document</h3>

<p><strong>Type :</strong> {selectedDoc?.type_document}</p>

<input
type="file"
onChange={(e) => setNewFile(e.target.files[0])}
/>

<div className={styles.modalActions}>
<button
  className={styles.btnSecondary}
  onClick={() => setModalOpen(false)}
>
  Annuler
</button>

<button
  className={styles.btnPrimary}
  onClick={updateDocument}
>
  Enregistrer
</button>
</div>

  </div>

</div>

</div>
)} */}

{/* {modalFonctionOpen && (

<div className="modal fade show d-block bg-dark bg-opacity-50">

<div className="modal-dialog">
<div className="modal-content p-4">

 <h4>Ajouter une fonction</h4>

 <div className="mb-3">
  <label>Fonction</label>
  <select
    className="form-control"
    onChange={e=>setFonctionId(e.target.value)}
  >
    <option value="">Choisir fonction</option>

    {fonctions.map(f=>(
      <option key={f.id} value={f.id}>
        {f.libelle}
      </option>
    ))}

  </select>
 </div>

 <div className="mb-3">
  <label>Date début</label>
  <input
    type="date"
    className="form-control"
    onChange={e=>setDateDebut(e.target.value)}
  />
 </div>

 <div className="mb-3">
  <label>Date fin</label>
  <input
    type="date"
    className="form-control"
    onChange={e=>setDateFin(e.target.value)}
  />
 </div>

 <div className="d-flex justify-content-end gap-2">

  <button
   className="btn btn-secondary"
   onClick={()=>setModalFonctionOpen(false)}
  >
   Annuler
  </button>

  <button
   className="btn btn-success"
   onClick={ajouterFonctionEmploye}
  >
   Enregistrer
  </button>

 </div>

</div>
</div>

</div>
)} */}
  </div>
  )
}
}
export default DetailsClient