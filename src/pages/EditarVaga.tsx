import styled from "styled-components"
import { FormVaga } from "../components/FormVaga"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const Container = styled.div`
  padding: 15px 25px;
  max-width: 913px;
  background: #fff;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  margin: 5px auto 40px auto;
`
export const EditarVaga = () => {
  const [tituloVaga, setTituloVaga] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    const Fetch = async () => {
      const response = await axios.get(`http://localhost:8080/vagas/${id}`);
      setTituloVaga(response.data.titulo)
    }
    Fetch();
  },[])



  return (
    <Container>
      <h1>Edtiar Vaga - {tituloVaga}</h1>
      <FormVaga />
    </Container>
  )
}
