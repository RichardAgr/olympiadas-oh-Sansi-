import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", costo: "", estado: true, foto: "" });

  useEffect(() => {
    axios.get(`http://localhost:8000/api/areas/${id}`).then((res) => setFormData(res.data));
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/areas/${id}`, formData);
    alert("Área actualizada 😎");
    navigate("/admin/areas");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Área</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre" value={formData.nombre} onChange={handleChange} className="w-full border p-2 rounded-xl" required />
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="w-full border p-2 rounded-xl" required />
        <input name="costo" type="number" value={formData.costo} onChange={handleChange} className="w-full border p-2 rounded-xl" required />
        <select name="estado" value={formData.estado} onChange={handleChange} className="w-full border p-2 rounded-xl">
          <option value={true}>Activa</option>
          <option value={false}>Inactiva</option>
        </select>
        <input name="foto" value={formData.foto} onChange={handleChange} className="w-full border p-2 rounded-xl" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditArea;
