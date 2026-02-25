import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from "./DetailsEmployee.module.css"
import { toast } from 'react-toastify';
import api from '../../api/api';
import { showError } from '../../utils/notify';

export const DetailPersone = () => {
    const [personne, setPersonne]=useState(null);
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [newFile, setNewFile] = useState(null);
    const navigate = useNavigate(); 
    // Fonction de l'employe
    const [modalFonctionOpen,setModalFonctionOpen]=useState(false);
    const [fonctionId,setFonctionId]=useState("");
    const [dateDebut,setDateDebut]=useState("");
    const [dateFin,setDateFin]=useState("");
    const [fonctions,setFonctions]=useState([]);
    //Pour recuperer le parametre de la route on ajoute ceci 
    const { id } = useParams();
    const fetchPersonne= async() =>{
      try {
        const res= await fetch(`http://localhost:8000/api/personnes/${id}`)
        const result= await res.json()
        setPersonne(result.data)
        console.log(result.data)
      } catch (error) {
        console.error("Erreur API :", error);
      }
      }
      //Suppression de la perssonne
      const  deletePersonne= async(id)=>{
          if(confirm('Voulez-vous vraiment supprimer??')){
            const res = await fetch(`http://localhost:8000/api/personnes/${id}`,{
              method:"DELETE"
            })
          }
          toast("Suppression éffectuée avec success");
          navigate('/liste-personne');
      }
      //Impression de la carte professionnelle 
      const downloadCard = async (id) => {
        try {
          const response = await api.get(`personne/${id}/carte`, {
            responseType: "blob",
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "carte_professionnelle.pdf");
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch (error) {
          console.error("Erreur téléchargement:", error);
        }
      };
      //Modal change personne file 
      const openModal = (doc) => {
        setSelectedDoc(doc);
        setModalOpen(true);
      };
    //Fonction de changement de document du dossier du personnel 
    const updateDocument = async () => {
      if (!newFile) {
        toast.error("Veuillez sélectionner un fichier");
        return;
      }
      const formData = new FormData();
      formData.append("document", newFile);
    
      try {
        console.log(selectedDoc?.doc_id)
        await api.post(`documents/${selectedDoc?.doc_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
              }
        });
    
        toast.success("Document modifié avec succès");
        setModalOpen(false);
        setNewFile(null);
        fetchPersonne(); // refresh
      } catch (error) {
        console.error(error);
        showError("Erreur lors de la modification");
      }
    };

//Ajout des fonctions a une personne
//Charger les fonctions 
const fetchFonctions = async()=>{
  try{
    const res = await api.get("/return-valeur/7");
    setFonctions(res.data.data || res.data);
  }catch(e){
    showError("Erreur chargement fonctions");
  }
 }

const openFonctionModal=()=>{
  setModalFonctionOpen(true);
 }

 const ajouterFonctionEmploye=async()=>{
  try{
    await api.post("/personne-fonction",{
      personne_id:id,
      valeur_id:fonctionId,
      date_debut:dateDebut,
      date_fin:dateFin
    });
    toast.success("Fonction ajoutée");
    setModalFonctionOpen(false);
    fetchPersonne();
  }catch(e){
    showError("Erreur ajout fonction");
  }
 }
 //Supprimer une fonction 
 const supprimerFonction = async (id) => {
    if (!window.confirm("Supprimer Cette fontion ?")) return
    await api.delete(`/personne-fonction/${id}`)
    fetchFonctions()
}
      useEffect(()=>{ 
          fetchPersonne();
          fetchFonctions()
      },[id])
 //Tres important car sans ce controle il peut essayer dacceder aux proprietes de personne pendant que celui ci nest pas encore chargé
    if (!personne) {
      return <div>Chargement...</div>;
    }else{
    return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.profile}>
        <img className={styles.avatar} src={personne.image_url} alt={`${personne.nom} ${personne.prenom}`} />

          <div>
            <h2 className={styles.name}>
              {personne.nom} {personne.prenom}
            </h2>
            {/* <p className={styles.role}>{personne.poste}</p> */}
            <p className={styles.matricule}>
              Matricule : <strong>{personne.matricule}</strong>
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary}  onClick={() => navigate(`/personne/edit/${personne.id}`)}>Modifier</button>
          <button className={styles.btnDanger}  onClick={() =>deletePersonne(personne.id)}>Supprimer</button>
          <button className={styles.btnSuccess}onClick={openFonctionModal} >Nouvelle une fonction</button>
          <button className={styles.btnSecondary} onClick={() => downloadCard(personne.id)}>
            Télécharger Carte
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>

        {/* Infos générales */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Informations générales</h3>
          <ul className={styles.detailsList}>
            <li><span>Matricule</span><strong>{personne.matricule}</strong></li>
            <li><span>Nom</span><strong>{personne.nom}</strong></li>
            <li><span>Prénom</span><strong>{personne.prenom}</strong></li>
            <li><span>Date de naissance</span><strong>{personne.date_de_naiss}</strong></li>
            <li><span>date d'embauche</span><strong>{personne.date_embauche}</strong></li>
            <li><span>Email</span><strong>{personne.email}</strong></li>
            <li><span>Téléphone</span><strong>{personne.telephone}</strong></li>
          </ul>
        </div>

        {/* Historique */}
         <div className={styles.card}>
          <h3 className={styles.cardTitle}>Historique dans l’entreprise</h3>

          <div className={styles.timeline}>
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
          </div>
        </div> 

        {/* Documents */}
         <div className={`${styles.card} ${styles.fullWidth}`}>
          <h3 className={styles.cardTitle}>Documents & Pièces administratives</h3>

          <table className={styles.documentsTable}>
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
          </table>
        </div> 

      </div>
{modalOpen && (

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
)}

{modalFonctionOpen && (

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
)}
    </div>
 
    

  )
}
}
