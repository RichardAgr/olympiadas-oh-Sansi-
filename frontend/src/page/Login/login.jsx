import  { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        //"http://localhost:5173/api/login",
        { email, password },
        { withCredentials: true } // habilita el envío/recepción de cookies
      );

      const data = response.data;
      if (!data.rol || (data.rol === "tutor" && !data.id)) {
        setError("Error al procesar la información del usuario.");
        return;
      }

      // Redireccionar según el rol
      switch (data.rol) {
        case "admin_sistema":
          navigate("/admin");
          break;
        case "admin_gestion":
          navigate("/respGest");
          break;
        case "tutor":
          if (data.id) {
            navigate(`/homeTutor/${data.id}/tutor/`);
          } else {
            setError("No se pudo obtener el ID del tutor.");
          }
          break;
        default:
          setError("Rol de usuario desconocido.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error de conexión con el servidor.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-text">
          <h1>Bienvenido a...</h1>
          <p>Únete al futuro de la ciencia y la tecnología</p>
        </div>
      </div>
      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>
          <h2 className="login-title">Iniciar Sesión</h2>

          <label>Correo Electrónico</label>
          <input
            type="email"
            placeholder="Ingresar correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

<label>Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"} // DINÁMICO
              placeholder="Ingresar contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? (
                <Eye size={20} strokeWidth={0.75} />
              ) : (
                <EyeOff size={20} strokeWidth={0.75} />
              )}
            </span>
          </div>

          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

          <a href="/homePrincipal/RecuperarContraseña" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
          <p className="register-link">
            ¿No tienes una cuenta? <a href="/homePrincipal/Registrate">Regístrate</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;