import {Container,Typography} from "@mui/material"
import TablaDatos from "./tabla/TablaDatos"

export const HU2nivelesCategoria = () => {
  return (
    <Container  maxWidth='lg' sx={{py:4}}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Registro de categoria
      </Typography>
      <TablaDatos/>
    </Container>
  )
}
