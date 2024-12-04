import styled from "styled-components"
import { FormEmpresa } from "../components/FormEmpresa"
import { Link } from "react-router-dom"

const Container = styled.div`
  padding: 15px 25px;
  max-width: 913px;
  background: #fff;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  margin: 5px auto 40px auto;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

export const AlterarDados = () => {
  return (
    <Container>
      <div>
        <h1>Altere seus dados!</h1>
        <Link to='/'>Voltar</Link>
      </div>
      <FormEmpresa />
    </Container>
  )
}
