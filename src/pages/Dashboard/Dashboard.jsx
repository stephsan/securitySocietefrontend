import React, { useEffect, useState } from "react";
import api from "../../api/api";

const Dashboard = () => {
    const [stats, setStats] = useState({
        personnel: {
          hommes: 0,
          femmes: 0,
          age_18_30: 0,
          age_31_50: 0,
          age_50_plus: 0
        },
        contrats: {
          clients: 0,
          factures_validees: 0,
          factures_payees: 0
        },
       
      });
      const fetchStats = async () => {
        try {
          const res = await api.get("/dashboard");
          setStats(res.data);
        } catch (error) {
          console.error("Erreur stats", error);
        }
      };
    
      useEffect(() => {
        fetchStats();
      }, []);
    
  return (
    <div className="container mt-4">

      <h3 className="mb-4">📊 Tableau de bord</h3>

      {/* ========================= */}
      {/* PERSONNEL */}
      {/* ========================= */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          Personnel
        </div>
        <div className="card-body">
          <div className="row text-center">

            <div className="col-md-3">
              <div className="card-dashboard p-3">
                <h5>👨 Hommes</h5>
                <h3>{stats.personnel.hommes}</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card-dashboard p-3">
                <h5>👩 Femmes</h5>
                <h3>{stats.personnel.femmes}</h3>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card-dashboard p-3">
                <small>18-30 ans</small>
                <strong>{stats.personnel.age_18_30}</strong>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card-dashboard p-3">
                <small>31-50 ans</small>
                <strong>{stats.personnel.age_31_50}</strong>
              </div>
            </div>

            <div className="col-md-2">
              <div className="card-dashboard p-3">
                <small>50+ ans</small>
                <strong>{stats.personnel.age_50_plus}</strong>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* CONTRATS / FACTURES */}
      {/* ========================= */}
      <div className="card mb-4">
        <div className="card-header bg-success text-white">
          Contrats & Factures
        </div>
        <div className="card-body">
          <div className="row text-center">

            <div className="col-md-4">
              <div className="card-dashboard p-3">
                <h5>👥 Clients</h5>
                <h3>{stats.contrats.clients}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-dashboard p-3">
                <h5>📄 Factures validées</h5>
                <h3>{stats.contrats.factures_validees}</h3>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card-dashboard p-3">
                <h5>💰 Factures payées</h5>
                <h3>{stats.contrats.factures_payees}</h3>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* DEPENSES */}
      {/* ========================= */}
      {/* <div className="card shadow">
        <div className="card-header bg-danger text-white">
          Dépenses
        </div>
        <div className="card-body">
          <div className="row text-center">

            <div className="col-md-6">
              <div className="card p-3">
                <h5>💸 Total dépenses</h5>
                <h3>{stats.depenses.total.toLocaleString()} FCFA</h3>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3">
                <h5>📅 Dépenses du mois</h5>
                <h3>{stats.depenses.mensuel.toLocaleString()} FCFA</h3>
              </div>
            </div>

          </div>
        </div>
      </div> */}

    </div>
  )
}

export default Dashboard