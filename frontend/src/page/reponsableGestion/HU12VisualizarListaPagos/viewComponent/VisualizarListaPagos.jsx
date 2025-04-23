import { useState,useEffect, use } from "react";
import SearchBar from "../../../../components/searchBar(hu12)/SearchBar"
import VisualizarTablaPagos from "../../../../components/visualizarTablaPagos/VisualizarTablaPagos";
import "./visualizarListaPagos.css"
import axios from "axios";

export default function VisualizarListaPagos(){
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState(null)
    const [searchPerformed, setSearchPerformed] = useState(false)


    useEffect(()=>{
        const getPayments = async () =>{
            try {
                setIsLoading(true)           
                const res = await axios.get('http://127.0.0.1:8000/api/pagos')
                
                if(res.status !== 200){
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                console.log(res.data.data.pagos)
                setPayments(res.data.data.pagos)
                setFilteredPayments(res.data.data.pagos)
                setIsLoading(false)
            } catch (error) {
                setError("Error al cargar los datos")
                setIsLoading(false)
                console.error(error)
            }
        }
        
        getPayments()
    },[])
    
    const handleSearch = (searchTerm) => {
        setSearchPerformed(!!searchTerm.trim())
        if(!searchTerm.trim()){
            setFilteredPayments(payments)
            return
        }

        const filtered = payments.filter(
            (payment) =>
              payment.tutor.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
              payment.tutor.apellidos.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          setFilteredPayments(filtered)
    }

    return(
        <div className="payment-container">
            <SearchBar onSearch={handleSearch}/>
            {isLoading? (
                <div className="loading">Cargando...</div>
            ): error? (
                <div className="error">{error}</div>
            ): filteredPayments.length ===0 && searchPerformed ?(
                <div className="no-resut">
                  <h3>No se encontraron tutores</h3>
                </div>
              ) : (
                <VisualizarTablaPagos payments={filteredPayments}/>
            )}
        </div>
    )
}