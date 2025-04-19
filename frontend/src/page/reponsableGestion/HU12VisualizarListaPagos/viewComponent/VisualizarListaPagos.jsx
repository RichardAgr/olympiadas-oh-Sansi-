import { useState,useEffect, use } from "react";
import SearchBar from "../../../../components/searchBar(hu12)/SearchBar"
import "./visualizarListaPagos.css"
import axios from "axios";

export default function VisualizarListaPagos(){
    const [payments, setPayments] = useState([])
    const [filteredPayments, setFilteredPayments] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState(null)


    useEffect(()=>{
        const getPayments = async () =>{
            try {
                setIsLoading(true)           
                const res = await axios.get('/json/hu12VisulizarPagos.json')
                
                if(res.status !== 200){
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                //console.log(res.data.data.pagos)
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
            ):(
                <h1>Mostrar tabla de pagos</h1>
            )}
        </div>
    )
}