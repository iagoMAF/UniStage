import styled from "styled-components"
import { FormEmpresa } from "../components/FormEmpresa"
import { Link } from "react-router-dom"

const Container = styled.div`
  padding: 15px 25px;
  max-width: 913px;
  background: #fff;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  margin: 5px auto 40px auto;

  .cabecalho {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

export const Cadastrar = () => {
  return (
    <Container>
      <div className="cabecalho">
        <h1>Realize seu cadastro!</h1>
        <Link to="/login">Voltar</Link>
      </div>
      <FormEmpresa />
    </Container>
  )
}
