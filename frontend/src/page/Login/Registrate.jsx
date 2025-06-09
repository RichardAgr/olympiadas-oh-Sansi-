import { useState, useEffect } from "react";
import axios from "axios"; // Importar axios
import "./Registrate.css";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Para redireccionar después del registro

const Registrate = () => {
  const navigate = useNavigate();
  const [competencia_id, setCompetenciaId]=useState(0)

const loadIdCompetencia = async () => {
    try {
        //obtener id comeptencia
 // Paso 1: Obtener competencia activa
    const compResponse =  await axios.get('http://localhost:8000/api/info-competencia-activa');
    const competencia = compResponse.data.data[0]; // Asegúrate de que es un array

    if (!competencia || !competencia.competencia_id) {
      throw new Error('No se encontró una competencia activa válida.');
    }
    setCompetenciaId(competencia.competencia_id)
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIdCompetencia();
  }, [competencia_id]);

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
    general: "",
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
        if (!/^\d{8,15}$/.test(value)) {
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
        } else if (!/(?=.*[0-9])/.test(value)) {
          error = "Debe contener al menos un número";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Debe contener al menos una mayúscula";
        } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
          error = "Debe contener al menos un carácter especial";
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

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Filtrado de valores según el campo
    let filteredValue = value;
    if (name === "nombres" || name === "apellidos") {
      filteredValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    } else if (name === "telefono" || name === "ci") {
      filteredValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: filteredValue,
    }));

    validateField(name, filteredValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors((prev) => ({ ...prev, general: "" }));

    // Validar todos los campos antes de enviar
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    try {
      // Preparar los datos para la API
        const dataToSend = {
        competencia_id: competencia_id, // Cambia esto según tu lógica
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo_electronico: formData.email,
        telefono: formData.telefono,
        ci: formData.ci,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      };
      const response = await axios.post(
        "http://localhost:8000/api/registrar-tutor",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Verificar si la respuesta indica éxito aunque sea status 200
      if (response.data && response.data.tutor_id) {
        // Registro exitoso - redirigir con mensaje
        navigate("/homePrincipal/login", {
          state: {
            registrationSuccess: true,
            message: "¡Registro exitoso! Ya puedes iniciar sesión.",
          },
        });
      } else {
        // La API respondió con 200 pero sin datos esperados
        navigate("/homePrincipal/login", {
          state: {
            registrationSuccess: true,
            message: "¡Registro completado con éxito!",
          },
        });
      }
    } catch (err) {
      // Manejar errores de conexión o validación del servidor
      let errorMessage = "Error en el registro";

      if (err.response) {
        // Si el backend devuelve un error de validación
        if (err.response.data && err.response.data.errors) {
          const backendErrors = err.response.data.errors;
          const newErrors = {};

          Object.keys(backendErrors).forEach((key) => {
            if (key === "correo_electronico")
              newErrors.email = backendErrors[key][0];
            else if (key === "password_confirmation")
              newErrors.confirmPassword = backendErrors[key][0];
            else newErrors[key] = backendErrors[key][0];
          });

          setErrors((prev) => ({ ...prev, ...newErrors }));
        }

        // Si el registro fue exitoso pero la respuesta no es estándar
        if (err.response.status === 200 && err.response.data) {
          // Verificar si hay datos de tutor en la respuesta
          if (err.response.data.nombres) {
            navigate("/homePrincipal/login", {
              state: {
                registrationSuccess: true,
                message: "¡Registro completado con éxito!",
              },
            });
            return;
          }
        }

        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "No se pudo conectar al servidor";
      }

      setErrors((prev) => ({ ...prev, general: errorMessage }));
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
          {errors.nombres && (
            <p className="registrate-error-message">{errors.nombres}</p>
          )}

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
          {errors.apellidos && (
            <p className="registrate-error-message">{errors.apellidos}</p>
          )}

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
          {errors.email && (
            <p className="registrate-error-message">{errors.email}</p>
          )}

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
          {errors.telefono && (
            <p className="registrate-error-message">{errors.telefono}</p>
          )}

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
          {errors.password ? (
            <p className="registrate-error-message">{errors.password}</p>
          ) : (
            <p className="password-requirements">
              La contraseña debe tener al menos 6 caracteres, incluir un número,
              una mayúscula y un carácter especial.
            </p>
          )}

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
          {errors.confirmPassword && (
            <p className="registrate-error-message">{errors.confirmPassword}</p>
          )}

          {/* Error general */}
          {errors.general && (
            <p className="registrate-error-message registrate-general-error">
              {errors.general}
            </p>
          )}

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
