
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/api';
import { showError } from '../utils/notify';

export const EditEmployee = () => {
  const navigate=useNavigate();
  const [typeDocuments, setTypeDocuments] = useState([]);
  const [personne, setPersonne]=useState(null);
  const [ListeSituationMatrimoniales, setListeSituationMatrimoniales] = useState([]);
  const [imageId, setImageId]=useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const formatDateForInput = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };
  const chargerImage= async(e)=>{
    const file= e.target.files[0];
    const formData= new FormData();
    formData.append('image',file)
    const res=await fetch("http://localhost:8000/api/save-temp-image",{
            method:'POST',
            body:formData
    });
    const result =await res.json()
    if(result.status==false){
        alert(result.errors.image)
        e.target.value=null
    }
    //console.log(result)
    setImageId(result.image.id)

  }

  //Afficher les données dans le formulaire de modification
  const { id } = useParams();
    const fetchPersonne= async() =>{
      try {
        const res= await fetch(`http://localhost:8000/api/personnes/${id}`)
        const result= await res.json()
        // setPersonne(result.data)
        const data=result.data
        reset({
            ...data,
            date_de_naiss: formatDateForInput(data.date_de_naiss),
            date_embauche: formatDateForInput(data.date_embauche)
          });
          {errors.date_de_naiss && (
            <small>Date de naissance obligatoire</small>
          )}
      } catch (error) {
        console.error("Erreur API :", error);
      }
      }
      const fetchSituationMatrimoniale = async()=>{
        try{
          const res = await api.get("/return-valeur/11");
          setListeSituationMatrimoniales(res.data.data || res.data);
        }catch(e){
          showError("Erreur chargement situation matrimoniale");
        }
    }
        const fetchTypes = async () => {
            try{
                const res = await api.get("/return-valeur/5");
                setTypeDocuments(res.data.data);
            }catch(e){
                showError("Erreur chargement de types de documents");
            }
            };
      useEffect(()=>{ 
          fetchSituationMatrimoniale();
          fetchPersonne();
          fetchTypes();
      },[id])
  const formSubmit = async(data)=>{
    const newData= {...data , image_id:imageId}
    fetch( `http://localhost:8000/api/personnes/${id}`,{
        method:"PUT",
        headers:{
            "content-type":"application/json"
        },
        credentials: 'include',
        body: JSON.stringify(newData)
    });
    toast("Modification éffectuée avec success");
    navigate('/liste-personne');
}
  return (
    < div className="card">
        <div className="card-header">
            <h5 className="card-title mb-0">Modifier les informations de  l'agent</h5>
        </div>
        <div className="card-body">
        <form onSubmit={handleSubmit(formSubmit)}>
        <div className="mb-3">
                        <label className="form-label">
                            Photo de l'agent
                        </label>

                        <input
                            type="file"
                            className="form-control"
                            onChange={chargerImage}
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-3">
                            <label className="form-label">
                                    Matricule
                            </label>
                                <input
                                    {...register('matricule', { required: true })}
                                    className="form-control"
                                    placeholder="Matricule"
                                />
                                {errors.matricule && <small>Matricule obligatoire</small>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label className="form-label">
                                    Nom de l'agent
                                </label>
                                <input
                                    {...register('nom', { required: true })}
                                    className="form-control"
                                    placeholder="Nom"
                                />
                                {errors.nom && <small>Nom obligatoire</small>}
                            </div>
                        </div>
                        <div className="col-md-4">
                            {/* Prénom */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Prénom de l'agent
                                </label>
                                <input
                                    {...register('prenom', { required: true })}
                                    className="form-control"
                                    placeholder="Prénom"
                                />
                                {errors.prenom && <small>Prénom obligatoire</small>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-md-4">  
                            <label className="form-label">
                                    Genre
                            </label>  
                            <select 
                                {...register('sexe',{ required: true })}
                                className="form-control"
                                >
                                <option value="">Choisir une genre</option>
                                <option value="F">Féminin</option>
                                <option value="M">Masculin</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                                <label className="form-label">
                                    Date de Naissance
                                </label>
                            <div className="mb-3">
                                <input
                                type="date"
                                    {...register('date_de_naiss',{ required: true })}
                                    className="form-control"
                                />
                                {errors.date_de_naiss && <small>Date de naissance obligatoire</small>}
                            </div>
                        </div>
                        <div className="col-md-4">
                                <label className="form-label">
                                    Lieu de Naissance
                                </label>
                            <div className="mb-3">
                                <input
                                type="text"
                                    {...register('lieu_de_naissance', { required: true })}
                                    className="form-control"
                                    placeholder="Lieu naissance"
                                />
                                    {errors.lieu_de_naiss && <small>Lieu de naissance obligatoire</small>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">  
                            <label className="form-label">
                                    Situation matrimonial
                            </label>  
                            <select 
                                {...register('situation_matrimoniale')}
                                className="form-control"
                                >
                                <option value="">Choisir une situation</option>

                                {ListeSituationMatrimoniales.map(p => (
                                    <option key={p.id} value={p.id}>
                                    {p.libelle}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">
                                    Nom Complet du conjoint
                            </label> 
                            <div className="mb-3">
                                <input
                                type="text"
                                    {...register('nom_du_conjoint')}
                                    className="form-control"
                                    placeholder="Nom du conjoint"
                                />
                                 
                            </div> 
                        </div>
                        <div className="col-md-5">  
                            <label className="form-label">
                                    Personne à prévenir en cas de besoin
                            </label>
                            <input
                                type="text"
                                    {...register('personne_a_prevenir', { required: true })}
                                    className="form-control"
                                    placeholder="Personne à prévenir en cas de besoin"
                             />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">  
                            <label className="form-label">
                                    Contacts
                            </label> 
                            <input
                                type="text"
                                    {...register('contacts', { required: true })}
                                    className="form-control"
                                    placeholder="Contacts"
                             />
                                {errors.contact && <small>Contact obligatoire</small>}
                        </div>
                        <div className="col-md-6">  
                            <label className="form-label">
                                    Date d'embauche
                            </label>
                            <input
                                type="date"
                                    {...register('date_embauche', { required: true })}
                                    className="form-control"
                                    placeholder="Date d'embauche"
                             />
                             {errors.date_embauche && <small>Date d'embauche obligatoire</small>}
                        </div>
                    
                    </div>
            
            <div className="mb-3 mt-3">
                <button 
                    className="btn btn-warning"
                    onClick={() => navigate(`/liste-personne`)}
                    >Annuler</button>
                <button className="btn btn-success"  type='submit'>Enregistrer</button>
            </div>
        </form>
            
        </div>
    </div>
  )
}
