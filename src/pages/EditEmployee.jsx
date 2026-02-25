
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const EditEmployee = () => {
  const navigate=useNavigate();
  const [personne, setPersonne]=useState(null);
  const [imageId, setImageId]=useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

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
        reset(result.data)
        //console.log(result.data)
      } catch (error) {
        console.error("Erreur API :", error);
      }
      }
      useEffect(()=>{ 
          fetchPersonne();
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
            <div className='row'>
                
                 <div className='col-md-6'>
                        <label htmlFor='' className='form-label'>Joindre la photo de l'agent</label>
                        <input 
                            {...register('image')}  
                            type="file" className="form-control" 
                            placeholder="Date de naissance"
                            onChange={chargerImage}
                            />
                </div>
                <div className='col-md-6'>
                    <label htmlFor='' className='form-label'>Matricule</label>
                        <input 
                            {...register('matricule',{required:true})} 
                            type="text" 
                            className="form-control" 
                            placeholder="Matricule"/>
                            {errors.matricule && <p>Le champ matricule est obligatoire</p>}
                </div>
                
                
                
                
            </div>
            <div className='row mt-2'>
            <div className='col-md-6'>
                        <label htmlFor='' className='form-label'>Nom</label>
                        <input 
                            {...register('nom',{required:true})} 
                            type="text" className="form-control" 
                            placeholder="Nom"/>
                            {errors.nom && <p>Le champ nom est obligatoire</p>}
                </div>
                <div className='col-md-6'>
                            <label htmlFor='' className='form-label'>Prénom</label>
                            <input 
                                {...register('prenom',{required:true})}
                                type="text" 
                                className="form-control" 
                                placeholder="Prenom"/>
                                {errors.prenom && <p>Le champ prenom est obligatoire</p>}    
                    </div>
            </div>
            <div className='row mt-2'>
            <div className='col-md-6'>
                        <label htmlFor='' className='form-label'>Date de naissance</label>
                        <input 
                            {...register('date_de_naiss',{required:true})}  
                            type="text" className="form-control" 
                            placeholder="Date de naissance"/>
                </div>
                <div className='col-md-6'>
                        <label htmlFor='' className='form-label'>Date d'embauche</label>
                        <input 
                            {...register('date_embauche',{required:true})} 
                            type="text" 
                            className="form-control" 
                            placeholder="Date d'embauche"/>
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
