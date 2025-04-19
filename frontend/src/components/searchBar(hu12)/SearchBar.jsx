import { useState } from "react"
import { Search } from "lucide-react"
import "./searchBar.css"

const SearchBar = ({onSearch}) =>{
    const [searchTerm,setSearchTerm] = useState("") 

    const handleChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        onSearch(value)
    }

    return(
        <div className="search-containerB">
            <div className="search-wrapperB">
                <Search className="search-iconB" size={24} />
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={handleChange}
                    className="search-inputB"
                />
      </div>
    </div>
    )
}

export default SearchBar