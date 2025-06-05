import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./RecuperarContraseña.css";
import ConfirmacionIcon from "../../assets/Confirmacion.png";
import axios from "axios";

const RecuperarContraseña = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [paso, setPaso] = useState(1);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    codigo: false,
    nuevaContraseña: false,
    confirmarContraseña: false
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const validateCode = (code) => /^\d{6}$/.test(code);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleEnviarEmail = async (e) => {
    e.preventDefault();
    setTouched({ ...touched, email: true });

    if (!email) {
      setError("Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    try {
      // ⬇️ QUITAMOS withCredentials: true
      await axios.post("http://127.0.0.1:8000/api/password/email", { correo_electronico: email });
      setPaso(2);
      setError("");
    } catch (error) {
      console.error(error);
      setError("No se pudo enviar el código. Verifica que el correo esté registrado.");
    }
  };

  const handleVerificarCodigo = async (e) => {
    e.preventDefault();
    setTouched({ ...touched, codigo: true });

    if (!codigo) {
      setError("Por favor ingresa el código de verificación");
      return;
    }

    if (!validateCode(codigo)) {
      setError("El código debe tener 6 dígitos numéricos");
      return;
    }

    try {
      // ⬇️ QUITAMOS withCredentials: true
      await axios.post("http://127.0.0.1:8000/api/password/verify", {
        correo_electronico: email,
        token: codigo
      });
      setPaso(4);
      setError("");
    } catch (error) {
      console.error(error);
      setError("Código inválido o expirado");
    }
  };

  const handleCambiarContraseña = async (e) => {
    e.preventDefault();
    setTouched({
      ...touched,
      nuevaContraseña: true,
      confirmarContraseña: true
    });

    if (!nuevaContraseña || !confirmarContraseña) {
      setError("Por favor completa ambos campos");
      return;
    }

    if (!validatePassword(nuevaContraseña)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número");
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // ⬇️ QUITAMOS withCredentials: true
      await axios.post("http://127.0.0.1:8000/api/password/reset", {
        correo_electronico: email,
        token: codigo,
        password: nuevaContraseña,
        password_confirmation: confirmarContraseña
      });
      setPaso(5);
      setError("");
    } catch (error) {
      console.error(error);
      setError("No se pudo cambiar la contraseña");
    }
  };

  const handleVolverLogin = () => navigate("/homePrincipal/login");
  const handleRetroceder = () => {
    if (paso > 1) {
      setPaso(paso - 1);
      setError("");
    } else {
      navigate("/homePrincipal/login");
    }
  };

  return (
    <div className="R-container">
      <div className="R-left">
        <div className="R-text">
          <h1>Bienvenido a...</h1>
          <p>Únete al futuro de la ciencia y la tecnología</p>
        </div>
      </div>
      <div className="R-right">
        <form className="R-card">
          {paso >= 1 && (
            <button type="button" className="R-back-button" onClick={handleRetroceder}>
              <ArrowLeft size={26} />
            </button>
          )}

          {paso === 1 && (
            <>
              <h3 className="R-subtitulo">Recuperar Contraseña</h3>
              <div className="R-input-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ingresar correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={touched.email && !validateEmail(email) ? "R-input-error" : ""}
                  required
                />
                {touched.email && !validateEmail(email) && (
                  <p className="R-input-hint">Ejemplo: usuario@dominio.com</p>
                )}
              </div>
              {error && <p className="R-error-message">{error}</p>}
              <button type="submit" className="R-button" onClick={handleEnviarEmail}>
                Enviar
              </button>
            </>
          )}

          {paso === 2 && (
            <>
              <div className="R-confirmacion-icon">
                <img src={ConfirmacionIcon} alt="Confirmación" />
              </div>
              <div className="R-confirmacion-message">
                <p>Enviamos un código de verificación a tu correo.</p>
                <p>Ingresa el código en la siguiente ventana para la recuperación de tu contraseña</p>
              </div>
              <button type="button" className="R-button" onClick={() => setPaso(3)}>
                Aceptar
              </button>
            </>
          )}

          {paso === 3 && (
            <>
              <h3 className="R-subtitulo">Recuperar Contraseña</h3>
              <div className="R-input-group">
                <label>Código de Verificación</label>
                <input
                  type="text"
                  placeholder="Ingresar código (6 dígitos)"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onBlur={() => handleBlur("codigo")}
                  className={touched.codigo && !validateCode(codigo) ? "R-input-error" : ""}
                  maxLength="6"
                  required
                />
                {touched.codigo && !validateCode(codigo) && (
                  <p className="R-input-hint">El código debe tener exactamente 6 dígitos</p>
                )}
              </div>
              {error && <p className="R-error-message">{error}</p>}
              <button type="submit" className="R-button" onClick={handleVerificarCodigo}>
                Aceptar
              </button>
            </>
          )}

          {paso === 4 && (
            <>
              <h3 className="R-subtitulo">Recuperar Contraseña</h3>
              <div className="R-input-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número"
                  value={nuevaContraseña}
                  onChange={(e) => setNuevaContraseña(e.target.value)}
                  onBlur={() => handleBlur("nuevaContraseña")}
                  className={touched.nuevaContraseña && !validatePassword(nuevaContraseña) ? "R-input-error" : ""}
                  required
                />
              </div>
              <div className="R-input-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  onBlur={() => handleBlur("confirmarContraseña")}
                  className={touched.confirmarContraseña && nuevaContraseña !== confirmarContraseña ? "R-input-error" : ""}
                  required
                />
              </div>
              {error && <p className="R-error-message">{error}</p>}
              <button type="submit" className="R-button" onClick={handleCambiarContraseña}>
                Aceptar
              </button>
            </>
          )}

          {paso === 5 && (
            <>
              <div className="R-confirmacion-icon">
                <img src={ConfirmacionIcon} alt="Confirmación" />
              </div>
              <h3 className="R-confirmacion-titulo">Contraseña Recuperada</h3>
              <button className="R-button" onClick={handleVolverLogin}>
                Aceptar
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RecuperarContraseña;