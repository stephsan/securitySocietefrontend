import React, { useContext, useEffect, useState } from 'react'
import { ItemEmployee } from './ItemEmployee';
import { useNavigate } from 'react-router-dom'



function ListePersone() {
    const navigate = useNavigate(); 
const[LesPersonnes,setLesPersonnes]=useState();
const[keyword,setKeyword]=useState();


const recupererListe=async()=>{
try {
    const res=await fetch('http://localhost:8000/api/personnes');
    const result= await res.json();
    console.log(result);
    setLesPersonnes(result.data|| result)
    console.log(result);
} catch (error) {
    console.error('Erreur récupération personnes:', error)//;
  }
}

const searchPersonne=async (e)=>{
    e.preventDefault();
    try {
        const res=await fetch('http://localhost:8000/api/personnes?keyword='+keyword);
        const result= await res.json();
        console.log(result);
        setLesPersonnes(result.data|| result)
        console.log(result);
    } catch (error) {
        console.error('Erreur récupération personnes:', error);
      }
}
useEffect(()=>{
    recupererListe();
},[])
  return (
<div className="employee-list-container">
    <form onSubmit={(e)=> searchPersonne(e) }>
    <div class="row">
        <input class="col-md-11" type="text" value={keyword} onChange={(e)=>setKeyword(e.target.value)}  placeholder='chercher'/>
        <button class="btnDefault col-md-1">Rechercher</button>
    </div>
    </form>
    
   <div className="employee-header">
            <h2>Liste des employés</h2>

            <button 
                className="add-btn"
                onClick={() => navigate(`/create-personne`)}
                >
                + Nouveau employé
        </button>
    </div>
     <div className="employee-grid">
        {
            (LesPersonnes)&& LesPersonnes.map((personne)=>{
                
                return (<ItemEmployee
                        key={personne.id}  
                        personne={personne}
                        />)
            })
        }
        
    </div>
   </div>
        
  )
}

export default ListePersone