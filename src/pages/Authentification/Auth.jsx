import React, { useContext, useEffect, useState } from 'react'
import styles from '../Authentification/Auth.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { showError, successMessage } from '../../utils/notify';
import { AuthContext } from '../../context/AuthContext';
const Auth = () => {
  
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("")
    const [loading, setLoading]=useState(false)
    const navigate=useNavigate();
    const { user,login} = useContext(AuthContext);
    const handleSubmit = async (e) => {
      e.preventDefault(); // 🔥 IMPORTANT

      try {
    
        await login(email, password);
    
        navigate("/liste-personne");
    
      } catch (error) {
        showError("Email ou mot de passe incorrect");
      }
    };
    // const handleSubmit= async(e) =>{
    //     e.preventDefault();
    //     setLoading(true)
    //     try{
    //       const response= await api.post('/login',{email,password})
    //       console.log(response.status)
    //       if(response.status==200){
    //       console.log(response.data);
    //           // 🔐 Sauvegarder le token
    //           localStorage.setItem("token", response.data.token);
    //           localStorage.setItem("user", JSON.stringify(response.data.user));
    //           if (user) {
    //             navigate("/liste-personne");
    //           }
    //       }
    //       else{
    //         showError("Une Erreur s'est produite !!!!")
    //       }
    //     }catch(error){
    //       if (error.response) {
    //         alert(error.response.data.message || "Erreur connexion");
    //       } else {
    //         alert("Erreur serveur");
    //       }
    //     }
    // }
     useEffect(() => {
       if (user) {
         navigate("/Dashboard");
       }
     }, [user]);
  return (
<div className={styles.content}>
<div className={styles.loginContainer}>
  <div className={styles.loginCard}>

    <div className={styles.loginHeader}>
      <div className={styles.companyLogo}>
        <div>
        <img class="img-profile rounded-circle" width={100}
                                    src="adminkit/img/logo_protect_sur.png"/>
        </div>
      </div>
      <h2>Bienvenue Secure</h2>
      <p>Entrez vos identifiant SVP</p>
    </div>

    <form onSubmit={handleSubmit} className={styles.loginForm} noValidate id="loginForm">
      <div className={styles.formGroup}>
        <div className={styles.inputWrapper}>
          <input 
                id="email"
                type="email" 
                name="email" 
                required autoComplete="email" 
                placeholder='Entrez votre email'
                value={email}
                 onChange={(e)=>{setEmail(e.target.value)}}
                />
        </div>
        
      </div>

      <div className={styles.formGroup}>
        <div className={`${styles.inputWrapper} ${styles.passwordWrapper}`}>
          <input 
                type="password" 
                name="password" 
                required autoComplete="current-password" 
                placeholder='Entrez votre email' 
                id="password"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}/>
          {/* <button type="button" className={styles.passwordToggle}>
            <span className={styles.toggleIcon}></span>
          </button> */}
        </div>
       
      </div>

      <div className={styles.formOptions}>
        <div className={styles.rememberWrapper}>
          <input type="checkbox" name="remember" />
          <label className={styles.checkboxLabel}>
            <span className={styles.checkboxCustom}></span>
            Se souvenir de moi
          </label>
        </div>

        <a href="#" className={styles.forgotPassword}>
          Mot de passe oublie?
        </a>
      </div>

      <button type="submit" className={styles.loginBtn}>
        <span className={styles.btnText}>Se Connecter</span>
        <span className={styles.btnLoader}></span>
      </button>
    </form>


  </div>
</div>
</div>


  )
}

export default Auth