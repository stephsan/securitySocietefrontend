import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import api from '../api/api';

function Personne() {

    const navigate = useNavigate();

    const [imageId, setImageId] = useState('');
    const [typeDocuments, setTypeDocuments] = useState([]);
    const [documents, setDocuments] = useState([]);
//recuperer la liste des types de documment au chargement du composant 
//id 5 pour le parametre_id de type de document qui est a 5
    const id=5
    useEffect(() => {
        const fetchTypes = async () => {
        const res = await api.get("/return-valeur/5");
        setTypeDocuments(res.data.data);
        };
        fetchTypes();
    }, []);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
/* =============================
     Gestion fichiers
  ============================= */

  const handleFileChange = (e, valeurId) => {
    setDocuments({
      ...documents,
      [valeurId]: e.target.files[0]
    });
  };
    // =============================
    // Upload temporaire image photo
    // =============================
    const chargerImage = async (e) => {

        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        try {

            const res = await fetch(
                "http://localhost:8000/api/save-temp-image",
                {
                    method: 'POST',
                    body: formData
                }
            );

            const result = await res.json();

            if (result.status === false) {
                alert(result.errors.image);
                e.target.value = null;
                return;
            }

            setImageId(result.image.id);

        } catch (error) {
            console.error(error);
        }
    };

    // =============================
    // Ajouter pièce jointe document
    // =============================
    const ajouterDocument = (type, file) => {

        setDocuments(prev => [
            ...prev,
            {
                type,
                file
            }
        ]);
    };

    // =============================
    // Submit form
    // =============================
    const formSubmit = async (data) => {

        try {

            const formData = new FormData();

            // Infos personne
            formData.append("matricule", data.matricule);
            formData.append("nom", data.nom);
            formData.append("prenom", data.prenom);
            formData.append("date_de_naiss", data.date_de_naiss);
            formData.append("date_embauche", data.date_embauche);
            formData.append("image_id", imageId);
            // ajouter fichiers dynamiquement
            Object.keys(documents).forEach(valeurId => {
                formData.append(`documents[${valeurId}]`, documents[valeurId]);
            });

            await api.post("/personnes/", formData, {
                headers: {
                  "Content-Type": "multipart/form-data"
                    }
                });

            toast.success("Agent enregistré avec succès");

            navigate('/liste-personne');

        } catch (error) {
            console.error(error);
            toast.error("Erreur enregistrement");
        }
    };

    return (

        <div className="card">
            <div className="card-header">
                <h5>Ajouter un Agent</h5>
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit(formSubmit)}>

                    {/* Photo */}
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

                    {/* Matricule */}
                    <div className="mb-3">
                        <input
                            {...register('matricule', { required: true })}
                            className="form-control"
                            placeholder="Matricule"
                        />
                        {errors.matricule && <small>Matricule obligatoire</small>}
                    </div>

                    {/* Nom */}
                    <div className="mb-3">
                        <input
                            {...register('nom', { required: true })}
                            className="form-control"
                            placeholder="Nom"
                        />
                    </div>

                    {/* Prénom */}
                    <div className="mb-3">
                        <input
                            {...register('prenom', { required: true })}
                            className="form-control"
                            placeholder="Prénom"
                        />
                    </div>

                    {/* Date naissance */}
                    <div className="mb-3">
                        <input
                        type="date"
                            {...register('date_de_naiss')}
                            className="form-control"
                            placeholder="Date naissance"
                        />
                    </div>
                    <div className="mb-3">
                        <input
                        type="date"
                            {...register('date_embauche')}
                            className="form-control"
                            placeholder="Date D'embauche"
                        />
                    </div>

                    {/* Documents */}
                    <hr />
                    <h5>Documents</h5>

                    {typeDocuments.map(doc => (
                    <div key={doc.id} className="mb-3">
                        <label>{doc.libelle}</label>
                        <input
                        type="file"
                        className="form-control"
                        onChange={(e) => handleFileChange(e, doc.id)}
                        />
                    </div> ))}

                    {/* Actions */}
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/liste-personne')}
                        >
                            Annuler
                        </button>

                        <button className="btn btn-success">
                            Enregistrer
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default Personne;