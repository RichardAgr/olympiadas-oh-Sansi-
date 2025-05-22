import { useState } from "react";
import "./Registrate.css";
import { Eye, EyeOff } from "lucide-react";

const Registrate = () => {

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    ci: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    ci: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones en tiempo real
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "nombres":
      case "apellidos":
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/.test(value)) {
          error = "Solo se permiten letras (mínimo 3 caracteres)";
        }
        break;
      case "telefono":
        if (!/^\d{7,15}$/.test(value)) {
          error = "Solo números (7-15 dígitos)";
        }
        break;
      case "ci":
        if (!/^[0-9]{5,10}[a-zA-Z]?$/.test(value)) {
          error = "Formato: 12345678 o 87654321";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email inválido";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Mínimo 6 caracteres";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Las contraseñas no coinciden";
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Manejo de cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Filtrado de valores según el campo
    let filteredValue = value;
    if (name === "nombres" || name === "apellidos") {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === "telefono") {
      filteredValue = value.replace(/\D/g, "");
    } else if (name === "ci") {
      filteredValue = value.replace(/[^0-9\-a-zA-Z]/g, "");
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));
    
    // Validación en tiempo real
    validateField(name, filteredValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    Object.keys(formData).forEach(key => {
      validateField(key, formData[key]);
    });
    
    // Verificar si hay errores
    if (Object.values(errors).some(error => error !== "")) {
      setErrors(prev => ({ ...prev, general: "Por favor corrige los errores" }));
      return;
    }
    
    // Si todo está bien, proceder con el registro
    try {
      // Aquí iría tu lógica de registro
      // navigate("/login"); // Redirigir después de registro exitoso
    } catch (err) {
      setErrors(prev => ({ ...prev, general: "Error en el registro: " + err.message }));
    }
  };

  return (
    <div className="registrate-container">
      <div className="registrate-left">
        <div className="registrate-text">
          <h1>Bienvenido a...</h1>
          <p>Únete al futuro de la ciencia y la tecnología</p>
        </div>
      </div>
      <div className="registrate-right">
        <form className="registrate-card" onSubmit={handleSubmit}>
          <h2 className="registrate-title">Regístrate</h2>

          {/* Nombre */}
          <label>Nombre(s)</label>
          <input
            type="text"
            name="nombres"
            placeholder="Ingresar nombre"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
          {errors.nombres && <p className="registrate-error-message">{errors.nombres}</p>}

          {/* Apellido */}
          <label>Apellido(s)</label>
          <input
            type="text"
            name="apellidos"
            placeholder="Ingresar apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
          {errors.apellidos && <p className="registrate-error-message">{errors.apellidos}</p>}

          {/* Email */}
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Ingresar correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="registrate-error-message">{errors.email}</p>}

          {/* Teléfono */}
          <label>Número de Teléfono</label>
          <input
            type="tel"
            name="telefono"
            placeholder="Ingresar Teléfono +591"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
          {errors.telefono && <p className="registrate-error-message">{errors.telefono}</p>}

          {/* CI */}
          <label>Carnet de Identidad</label>
          <input
            type="text"
            name="ci"
            placeholder="Ingresar C.I."
            value={formData.ci}
            onChange={handleChange}
            required
          />
          {errors.ci && <p className="registrate-error-message">{errors.ci}</p>}

          {/* Contraseña */}
          <label>Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingresar contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye size={20} strokeWidth={0.75} />
              ) : (
                <EyeOff size={20} strokeWidth={0.75} />
              )}
            </span>
          </div>
          {errors.password && <p className="registrate-error-message">{errors.password}</p>}

          {/* Confirmar Contraseña */}
          <label>Confirmar Contraseña</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <span
              className="show-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <Eye size={20} strokeWidth={0.75} />
              ) : (
                <EyeOff size={20} strokeWidth={0.75} />
              )}
            </span>
          </div>
          {errors.confirmPassword && <p className="registrate-error-message">{errors.confirmPassword}</p>}

          {/* Error general */}
          {errors.general && <p className="registrate-error-message registrate-general-error">{errors.general}</p>}

          <button type="submit" className="registrate-button">
            Registrarse
          </button>
          <p className="login-link">
            ¿Ya tienes una cuenta?{" "}
            <a href="/homePrincipal/login">Iniciar Sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registrate;