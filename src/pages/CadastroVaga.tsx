import styled from "styled-components"
import { FormVaga } from "../components/FormVaga"

const Container = styled.div`
  padding: 15px 25px;
  max-width: 913px;
  background: #fff;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  margin: 5px auto 40px auto;
`

const CadastroVaga = () => {
  return (
    <Container>
      <h1>Cadastro de Vaga</h1>
      <FormVaga />
    </Container>
  )
}

export default CadastroVaga