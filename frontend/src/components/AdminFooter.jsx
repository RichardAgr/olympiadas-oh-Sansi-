import { Mail, Facebook, Instagram } from "lucide-react";
import "./AdminFooter.css";

const AdminFooter = () => {
  return (
    <footer className="admin-footer homePrincipal">
      <div className="footer-left homePrincipal">
        <p className="contact-title homePrincipal">Contáctate con nosotros:</p>
        
        <div className="social-icons homePrincipal">
          <a 
            href="mailto:ohsansi@umss.edu" 
            className="contact-link homePrincipal"
            aria-label="Enviar correo electrónico"
          >
            <Mail size={24} className="icon homePrincipal" />
            <span className="contact-text homePrincipal">ohsansi@umss.edu</span>
          </a>
          
          <a
            href="https://www.facebook.com/profile.php?id=61560666333554"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link homePrincipal"
            aria-label="Visitar Facebook"
          >
            <Facebook size={24} className="icon homePrincipal" />
            <span className="contact-text homePrincipal">OH SAN SI</span>
          </a>
          
          <a
            href="https://www.instagram.com/ohsansi/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link homePrincipal"
            aria-label="Visitar Instagram"
          >
            <Instagram size={24} className="icon homePrincipal" />
            <span className="contact-text homePrincipal">@ohsansi</span>
          </a>
        </div>
      </div>
      
      <div className="footer-right homePrincipal">
        <p className="org-title homePrincipal"><strong>Responsables del evento</strong></p>
        <p className="org-detail homePrincipal">
          Facultad de Ciencias y Tecnología<br />
          Universidad Mayor de San Simón<br />
          (UMSS)
        </p>
      </div>
    </footer>
  );
};

export default AdminFooter;