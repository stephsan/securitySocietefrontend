import React, { useState } from 'react'
import api  from '../api/api';
import { toast } from 'react-toastify';
import { showError, successMessage } from '../utils/notify';
import { useNavigate } from 'react-router-dom';


function User() {
  const [name, setName]=useState("");
  const [email, setEmail]=useState("");
  const [password, setPassword]=useState("")
  const [confirmPassword, setConfirmPassword]=useState("")
  const [loading, setLoading]=useState(false)

  const navigate=useNavigate();
  const handleSubmit= async(e) =>{
    e.preventDefault();
    setLoading(true)
    if(password!==confirmPassword){
      showError("La confirmation du mot de passe incorrecte");
      setLoading(false)
      return
    }
    try{
       const response= await api.post('/users',{name,email,password})
      
       if(response.status==200){
         navigate('/')
         successMessage("L'utilisateur a été ajouter avec succes ")
       }
       else{
         showError("Une Erreur s'est produite !!!!")
       }
      
    }catch(error){
      showError(error.response.data.message)
    }

  }
  return (
    < div className="card">
        <div className="card-header">
            <h5 className="card-title mb-0">Ajouter un utilisateur</h5>
        </div>
        <div className="card-body">
        <form onSubmit={handleSubmit}>
            <div className='row'>
                
                 <div className='col-md-6'>
                        <label htmlFor='' className='form-label'>Nom</label>
                        <input 
                            type="text" className="form-control" 
                            placeholder="Entrez votre nom complet"
                            value={name}
                            onChange={(e)=>{setName(e.target.value)}}
                            />
                </div>
                <div className='col-md-6'>
                        <label htmlFor='' className='form-label'>Email</label>
                        <input 
                            type="text" className="form-control" 
                            placeholder="Entrez votre email"
                            value={email}
                            onChange={(e)=>{setEmail(e.target.value)}}
                          />
                </div>
                
            </div>
            <div className='row mt-2'>
            <div className='col-md-6'>
                    <label htmlFor='' className='form-label'>Confirmer le mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Mot de passe"
                            value={confirmPassword}
                            onChange={(e)=>{setConfirmPassword(e.target.value)}}/>
                </div>
                <div className='col-md-6'>
                    <label htmlFor='' className='form-label'>Mot de passe</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}/>
                            
                </div>
                
            </div>
            <div className="mb-3 mt-3">
                <button 
                    className="btn btn-warning"
                    onClick={() => navigate(`/liste-personne`)}
                    >Annuler</button>
              {!loading ?
                <button className="btn btn-success"  type='submit'>
                  Creer
                </button>
                :
                <button className="btn btn-success"  type='submit'>
                  Creer
                </button>
              }
            </div>
        </form>
            
        </div>
    </div>
  )
}

export default User