import React, { useEffect, useState } from 'react'
import styles from "../pages/DetailsEmploye/DetailsEmployee.module.css"
import api from '../api/api'
import { useNavigate, useParams } from 'react-router-dom';
import { showError, successMessage } from '../utils/notify';

const DetailsClient = () => {
    const navigate= useNavigate();
    const { id } = useParams();
    const [client,setClient]=useState(null);
    const [modalFactureOpen, setModalFactureOpen] = useState(false)
    const [selectedContrat, setSelectedContrat] = useState(null);
    const [lignesFacture, setLignesFacture] = useState([]);
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");

    const [modalStatutOpen, setModalStatutOpen] = useState(false);
    const [factureSelectionnee, setFactureSelectionnee] = useState(null);
    const [actionStatut, setActionStatut] = useState("");

    const ouvrirFacturation = (contrat) => {
      console.log(contrat)
      const lignes = contrat.lignes.map(ligne => ({
        contrat_ligne_id: ligne.ligne_id,
        prestation_id: ligne.prestation_id,
        prestation: ligne.prestation,
        quantite: ligne.quantite,
        montant_unitaire:ligne.montant_unitaire,
        montant_prestation:ligne.montant_prestation,
        jours: 30
      }));
        setLignesFacture(lignes);
        setSelectedContrat(contrat);
        setModalFactureOpen(true);
      };

  //Modifier nombre de jour de la prestation
  const modifierJour = (index, valeur) => {

    const nouvellesLignes = [...lignesFacture];
  
    nouvellesLignes[index].jours = valeur;
  
    setLignesFacture(nouvellesLignes);
  };
  const ouvrirModalStatut = (facture, action) => {
    setFactureSelectionnee(facture);
    setActionStatut(action);
    setModalStatutOpen(true);
  };

  const confirmerChangementStatut = async () => {
    try {
      await changerStatut(factureSelectionnee.facture_id, actionStatut);
  
      setModalStatutOpen(false);
      setFactureSelectionnee(null);
      setActionStatut("");
  
    } catch (error) {
      showError("Erreur lors du changement de statut");
    }
  };
//Creation de la facture 

const creerFacture = async () => {
    try {
        const res= await api.post(`/contrats/${selectedContrat.id}/facturer`, {
        contrat_id: selectedContrat.contrat_id,
        date_debut: dateDebut,
        date_fin: dateFin,
        lignes: lignesFacture
      });
      await recupererClient();
      successMessage("Facture créée avec succès");
      setModalFactureOpen(false);
      setDateDebut("");
      setDateFin("");
    } catch (error) {
        if(error.status==400){
            showError('Une facture a deja été créée pour ce contrat sur la même période');
            setModalFactureOpen(false);
        }else{
            showError('Erreur serveur !!!');
        }
        
    }
  };

  //Imprimer une facture 
  const imprimerFacture = async (factureId) => {
    try {
      const response = await api.get(`/factures/${factureId}/pdf`, {
        responseType: "blob",
      });
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `facture_${factureId}.pdf`);
      document.body.appendChild(link);
      link.click();
  
    } catch (error) {
      showError("Erreur lors du téléchargement du PDF");
    }
  };
  //Changer le statut d'une facture
  const changerStatut = async (factureId, action) => {
    try {
      await api.post(`/factures/${factureId}/changer-statut`, {
        action: action
      });
  
      successMessage("Statut mis à jour avec succès");
  
      // 🔄 refresh
      await recupererClient();
  
    } catch (error) {
      showError("Erreur lors du changement de statut");
    }
  };
//Details du client 
    const  recupererClient= async() =>{
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

      <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3 className={styles.cardTitle}>Lister les contrats du client</h3>
          <table className={styles.documentsTable}>
            <thead>
              <tr>
                <th>Numero</th>
                <th>Montant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {client.contrats?.map((contrat, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{contrat.numero_contrat}</td>
                  <td>{contrat.montant_contrat}</td>
                  <td>
                    {/* <a href={contrat.download_url} className="btn btn-sm btn-default">
                      <i className="bi bi-eye"></i>
                    </a> */}
                    <button  className="btn btn-sm btn-primary me-2"  onClick={() => navigate(`/modifier-contrat/${contrat.contrat_id}`)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => ouvrirFacturation(contrat)}
                    >
                        <i className="bi bi-receipt"></i> Facturer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 


      {/* Documents */}
       <div className={`${styles.card} ${styles.fullWidth}`}>
        <h3 className={styles.cardTitle}>Les factures </h3>

        <table className={styles.documentsTable}>
          <thead>
            <tr>
              <th>Ordre</th>
              <th>Numero Facture</th>
              <th>Contrat</th>
              <th>Pérode</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {client.factures?.map((facture, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{facture.numero_facture}</td>
                <td>{facture.numero_contrat}</td>
                <td>{facture.date_debut} au {facture.date_fin}</td>
                <td>{facture.montant_total}</td>
                <td>{facture.statut}</td>

                <td>
                  
                    {facture.statut == "brouillon" && (
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => ouvrirModalStatut(facture, "valider")}
                      >
                        ✔ Valider
                      </button>
                    )}

                    {/* VALIDEE */}
                    {facture.statut === "validee" && (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => ouvrirModalStatut(facture, "payer")}
                        >
                          💰 Payer
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => ouvrirModalStatut(facture, "rejeter")}
                        >
                          ↩ Rejeter
                        </button>
                      </>
                    )}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => imprimerFacture(facture.facture_id)}
                    >
                    <i className="bi bi-printer"></i> PDF
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> 
      </div> 

    </div>
    {modalStatutOpen && (
  <div className="modal fade show d-block bg-dark bg-opacity-50">
    <div className="modal-dialog">
      <div className="modal-content p-4">

        <h5>Confirmation</h5>

        <p>
          Voulez-vous vraiment{" "}
          <strong>
            {actionStatut === "valider" && "valider"}
            {actionStatut === "payer" && "marquer comme payée"}
            {actionStatut === "rejeter" && "rejeter"}
          </strong>{" "}
          la facture{" "}
          <strong>{factureSelectionnee?.numero_facture}</strong> ?
        </p>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setModalStatutOpen(false)}
          >
            Annuler
          </button>

          <button
            className="btn btn-danger"
            onClick={confirmerChangementStatut}
          >
            Confirmer
          </button>
        </div>

      </div>
    </div>
  </div>
)}
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
{modalFactureOpen && (
  <div className="modal fade show d-block bg-dark bg-opacity-50">
    <div className="modal-dialog modal-xl">
      <div className="modal-content p-4">

        <h4>Facturer le contrat</h4>

        <p>
          Contrat : <strong>{selectedContrat?.numero_contrat}</strong>
        </p>

        <div className="mb-3">
          <label>Date début</label>
          <input
            type="date"
            className="form-control"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Date fin</label>
          <input
            type="date"
            className="form-control"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>Prestation</th>
            <th>Quantité</th>
            <th>Montant Unitaire</th>
            <th>Montant Prestation</th>
            <th>Nombre de jours</th>
          </tr>
          </thead>
          <tbody>
          {lignesFacture.map((ligne, index) => (

              <tr key={index}>
                <td>{ligne.prestation}</td>
                <td>{ligne.quantite}</td>
                <td>{ligne.montant_unitaire}</td>
                <td>{ligne.montant_prestation}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={ligne.jours}
                    min="1"
                    onChange={(e) =>
                      modifierJour(index, e.target.value)
                    }
                  />
                </td>

              </tr>
                ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => setModalFactureOpen(false)}
          >
            Annuler
          </button>

          <button
            className="btn btn-success"
            onClick={creerFacture}
          >
            Générer Facture
          </button>
        </div>

      </div>
    </div>
  </div>
)}
  </div>
  )
  
}
}
export default DetailsClient