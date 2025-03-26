import CrearCategoria from "../../components/nivelsCategoria/tabla/customsTablaDatos/flowCategoria/crearCategoria/CrearCategoria";

export const ENDPOINTS = {
    /* obtiene el area relacionado a su categoria y grado */
    areaCategoriaGrado:"areaCategoriaGrado",
    eliminarCategoria:(id)=>`/categorias/${id}`,
    eliminarGrado:(id)=>`/categorias/${id}/eliminarGrados`,
    crearCategoria:"crearCategoria"
}