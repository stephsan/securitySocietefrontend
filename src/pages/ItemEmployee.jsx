import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ItemEmployee = ({personne}) => {
    const navigate = useNavigate(); 
  return (
    <div className="employee-card">
    <div className="employee-image">
      <img src={personne.image_url} alt={`${personne.nom} ${personne.prenom}`} />
    </div>

    <div className="employee-info">
      <h3 className="employee-name">{personne.nom}</h3>
      <p className="employee-firstname">{personne.prenom}</p>
      <p className="employee-matricule">
        Matricule : <span>{personne.matricule}</span>
      </p>

      {/* <a href={`/personne/${personne.id}`} className="details-btn" >
        Voir détails
      </a> */}
      <button 
        className="details-btn"
        onClick={() => navigate(`/personne/${personne.id}`)}
        >
        Voir détails
     </button>
    </div>
  </div>
  )
}
