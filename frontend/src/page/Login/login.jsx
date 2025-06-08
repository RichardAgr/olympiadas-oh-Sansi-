import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //Interceptor Global de Axios para enviar token automáticamente
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          correo_electronico: email,
          password: password
        }
      );

      const data = response.data;

      // Guardar token y datos en localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      localStorage.setItem("rol", data.rol);

      // Redirigir según rol
      switch (data.rol) {
        case "admin":
          navigate("/admin");
          break;
        case "responsable":
          navigate("/respGest/" + data.usuario.responsable_id + "/Home");
          break;
        case "tutor":
          if (data.usuario && data.usuario.tutor_id) {
            navigate(`/homeTutor/${data.usuario.tutor_id}/tutor/`);
          } else {
            setError("No se pudo obtener el ID del tutor.");
          }
          break;
        default:
          setError("Rol de usuario desconocido.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.mensaje) {
        setError(err.response.data.mensaje);
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
              type={showPassword ? "text" : "password"}
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
                <Eye size={20} strokeWidth={1} />
              ) : (
                <EyeOff size={20} strokeWidth={1} />
              )}
            </span>
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
          )}

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
