import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function Sidebar() {
	
	
  return (
    
	<ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

	<a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
		{/* <div className="sidebar-brand-icon rotate-n-15">
			<i className="fas fa-laugh-wink"></i>
		</div> */}
		<div className="sidebar-brand-text mx-3">GesTSecure <sup></sup></div>
	</a>


	<hr className="sidebar-divider my-0"/>

	<li className="nav-item">
		 <NavLink to="/" className="nav-link" href="index.html">
			<i className="fas fa-fw fa-tachometer-alt"></i>
		<span>Dashboard</span></NavLink> 
	</li>

	<hr className="sidebar-divider"/>

	<div className="sidebar-heading">
		Gestion de l'entreprise
	</div>

	<li className="nav-item">
		<a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTwo"
			aria-expanded="true" aria-controls="collapseTwo">
			<i className="fas fa-fw fa-cog"></i>
			<span>Gestion des contrats</span>
		</a>
		<div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
			<div className="bg-white py-2 collapse-inner rounded">
				{/* <h6 className="collapse-header">Custom Components:</h6> */}
				<NavLink to="/liste-clients" className="collapse-item" href="buttons.html">Clients</NavLink>
				<NavLink to="/lister-contrat" className="collapse-item" href="cards.html">Contrats</NavLink>
			</div>
		</div>
	</li>


	<li className="nav-item">
		<a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseUtilities"
			aria-expanded="true" aria-controls="collapseUtilities">
			<i className="fas fa-fw fa-wrench"></i>
			<span>Ressources Humaine</span>
		</a>
		<div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities"
			data-parent="#accordionSidebar">
			<div className="bg-white py-2 collapse-inner rounded">
				<NavLink to="/liste-personne" className="collapse-item" href="utilities-color.html">Personnels</NavLink>
				<NavLink to="/liste-personne" className="collapse-item" href="utilities-color.html">Sanctions</NavLink>
				{/* <a className="collapse-item" href="utilities-border.html">Borders</a>
				<a className="collapse-item" href="utilities-animation.html">Animations</a>
				<a className="collapse-item" href="utilities-other.html">Other</a> */}
			</div>
		</div>
	</li>

	<hr className="sidebar-divider"/>

	<div className="sidebar-heading">
		Adminstration
	</div>

	<li className="nav-item active">
		<a className="nav-link" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="true"
			aria-controls="collapsePages">
			<i className="fas fa-fw fa-folder"></i>
			<span>Paramétrage</span>
		</a>
		<div id="collapsePages" className="collapse show" aria-labelledby="headingPages"
			data-parent="#accordionSidebar">
			<div className="bg-white py-2 collapse-inner rounded">
				<NavLink to="/liste-parametre" className="collapse-item" href="login.html">Paramètres</NavLink>
				<NavLink to="/liste-valeur" className="collapse-item" href="login.html">Valeurs</NavLink>
				<NavLink to="/liste-prestation" className="collapse-item" href="login.html">Prestations</NavLink>
				
				{/* <a className="collapse-item" href="register.html">Register</a>
				<a className="collapse-item" href="forgot-password.html">Forgot Password</a>
				<div className="collapse-divider"></div>
				<h6 className="collapse-header">Other Pages:</h6>
				<a className="collapse-item" href="404.html">404 Page</a>
				<a className="collapse-item active" href="blank.html">Blank Page</a> */}
			</div>
		</div>
	</li>

	
	{/* <li className="nav-item">
		<a className="nav-link" href="charts.html">
			<i className="fas fa-fw fa-chart-area"></i>
			<span>Charts</span></a>
	</li>

	<li className="nav-item">
		<a className="nav-link" href="tables.html">
			<i className="fas fa-fw fa-table"></i>
			<span>Tables</span></a>
	</li> */}

	
	<hr className="sidebar-divider d-none d-md-block"/>
	<div className="text-center d-none d-md-inline">
		<button className="rounded-circle border-0" id="sidebarToggle"></button>
	</div>

</ul>
    
  )
}

export default Sidebar