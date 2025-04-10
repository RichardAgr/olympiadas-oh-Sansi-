import "./AdminFooter.css";

const AdminFooter = () => {
    return (
      <footer className="admin-footer">
        <div className="footer-left">
          <p>Contáctate con</p>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1384/1384005.png"
              alt="Facebook"
              width="30"
            />
          </a>
        </div>
        <div className="footer-right">
          <p><strong>Responsables del evento</strong></p>
          <p>Facultad de Ciencias y Tecnología<br />(UMSS)</p>
        </div>
      </footer>
    );
  };
  
  export default AdminFooter;
  