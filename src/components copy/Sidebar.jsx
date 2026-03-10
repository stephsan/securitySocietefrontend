import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function Sidebar() {
	
	
  return (
    
        <nav id="sidebar" className="sidebar js-sidebar">
			<div className="sidebar-content js-simplebar">
				<a className="sidebar-brand" href="index.html">
          <span className="align-middle">AdminKit</span>
        </a>

				<ul className="sidebar-nav">
					<li className="sidebar-header">
						Pages
					</li>

					<li className="sidebar-item active">
					{/* <a className="sidebar-link" href="index.html"> */}
                    <NavLink to="/" end className="sidebar-link">
                    <i className="align-middle" data-feather="sliders"></i> <span className="align-middle">Dashboard</span>
                    </NavLink>
                        
                    {/* </a> */}
					</li>
                    <li className="sidebar-item">
                        <NavLink to="/liste-personne" className="sidebar-link">
                            <i className="align-middle" data-feather="personne"></i> <span className="align-middle">Personnelles</span>
                        </NavLink>
					</li>
					<li className="sidebar-item">
                        <NavLink to="/liste-clients" className="sidebar-link">
                            <i className="align-middle" data-feather="user"></i> <span className="align-middle">Clients</span>
                        </NavLink>
					</li>
					
					<li className="sidebar-item">
					<NavLink to="/lister-contrat" className="sidebar-link">
              			<i className="align-middle" data-feather="log-in"></i> <span className="align-middle">Contrats</span>
					</NavLink>
					</li>

					<li className="sidebar-item" >
						<a className="sidebar-link" href="pages-sign-up.html">
             			<i className="align-middle" data-feather="user-plus"></i> <span className="align-middle">Sign Up</span>
            </a>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" href="pages-blank.html">
              <i className="align-middle" data-feather="book"></i> <span className="align-middle">Blank</span>
            </a>
					</li>

					<li className="sidebar-header">
						Parametrage & Adminstration
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" href="ui-buttons.html">
              <i className="align-middle" data-feather="square"></i> <span className="align-middle">Utilisateurs</span>
            </a>
					</li>

					<li className="sidebar-item">
						<NavLink to="/liste-parametre" className="sidebar-link">	
             			 	<i className="align-middle" data-feather="check-square"></i> <span className="align-middle">Parametres</span>
            			</NavLink>
					</li>

					<li className="sidebar-item">
					<NavLink to="/liste-valeur" className="sidebar-link">
              			<i className="align-middle" data-feather="grid"></i> <span className="align-middle">Valeurs</span>
					</NavLink>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" href="ui-typography.html">
              <i className="align-middle" data-feather="align-left"></i> <span className="align-middle">Roles</span>
            </a>
					</li>

					<li className="sidebar-item">
					<NavLink to="/liste-prestation" className="sidebar-link">
              			<i className="align-middle" data-feather="coffee"></i> <span className="align-middle">Prestation </span>
					</NavLink>
					</li>

					<li className="sidebar-header">
						Plugins & Addons
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" href="charts-chartjs.html">
              <i className="align-middle" data-feather="bar-chart-2"></i> <span className="align-middle">Charts</span>
            </a>
					</li>

					<li className="sidebar-item">
						<a className="sidebar-link" href="maps-google.html">
              <i className="align-middle" data-feather="map"></i> <span className="align-middle">Maps</span>
            </a>
					</li>
				</ul>

				<div className="sidebar-cta">
					<div className="sidebar-cta-content">
						<strong className="d-inline-block mb-2">Upgrade to Pro</strong>
						<div className="mb-3 text-sm">
							Are you looking for more components? Check out our premium version.
						</div>
						<div className="d-grid">
							<a href="upgrade-to-pro.html" className="btn btn-primary">Upgrade to Pro</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
    
  )
}

export default Sidebar