import React, { useEffect, useState } from 'react'
import api from '../api/api';
import { showError } from '../utils/notify';
import { useNavigate } from 'react-router-dom';

const ListerContrat = () => {
  
    const[contrats,setContrat]=useState();
    const navigate=useNavigate()
    
    
    const ListerContrat = async () => {
        try {
          const res = await api.get("/contrats")
          setContrat(res.data.data)
    
        } catch (e) {
          showError("Erreur serveur")
        }
      }
    
      useEffect(() => {
        ListerContrat()
      }, [])
  return (
    <div className="card p-4">

      <div className="d-flex justify-content-between mb-3">
        <h4>Liste des Contrats</h4>

        <button className="btn btn-success"
           onClick={() => navigate(`/add-contrat`)}>
          <i className="bi bi-plus-circle"></i> Ajouter
        </button>
      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-light">
          <tr>
            <th>N</th>
            <th>Numero</th>
            <th>Code Client</th>
            <th>Denomination Client</th>
            <th>Montant</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>

          {contrats?.map((contrat, index) => (
            <tr key={contrat.id}>

              <td>{index + 1}</td>

              <td>{contrat?.numero_contrat || "-"}</td>

              <td>{contrat?.code_client}</td>

              <td>{contrat?.denom_client || "-"}</td>
              <td>{contrat?.montant_contrat || "-"}</td>

              <td className="text-center">
              <button 
                className="btn btn-sm btn-warning me-2"
                onClick={() => navigate(`/modifier-contrat/${contrat.id}`)}
                >
                <i className="bi bi-pencil"></i>
            </button>
            <button 
                className="btn btn-sm btn-warning me-2"
                onClick={() => navigate(`/modifier-contrat/${contrat.id}`)}
                >
                <i className="bi bi-pencil"></i>
            </button>

                 {/*<button
                  className="btn btn-sm btn-danger"
                  onClick={() => supprimerValeur(v.id)}>
                  <i className="bi bi-trash"></i>
                </button> */}

              </td>

            </tr>
          ))}

        </tbody>

      </table>
    </div>
  )
}

export default ListerContrat