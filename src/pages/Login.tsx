import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components"

const Container = styled.div`
  max-width: 580px;
  background: #fff;
  padding: 40px;
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  margin: 35px auto 0 auto;

  h1 {
    font-size: 35px;
    margin-bottom: 35px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40px;
    gap: 25px;

    .info-extra {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      a {
        display: block;
        width: fit-content;
      }
    }

    .group {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 5px;

      div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          color: #F00;
        }
      }

      &.check {
        width: fit-content;
        flex-direction: row;
        align-items: center;

        label, input {
          width: fit-content;
        }
      }

      label {
        font-size: 18px;
      }

      input {
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        width: 100%;
        background: #fff;
        font-size: 18px;

        &:focus {
          border: none;
        }
      }
    }

    button {
      width: 100%;
      background: #2C48FF;
      padding: 10px;
      border-radius: 9px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .cadastro {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 40px;
    margin-top: 35px;
    gap: 15px;
    
    .separacao {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .line {
        width: 164px;
        height: 1px;
        background: #000;
      }

      p {
        font-size: 18px;
        font-weight: bold;
      }
    }

    a {
      font-size: 18px;
      color: #000;
    }
  }
`

interface LoginProps {
  email?: string;
  senha?: string;
}

interface EmpresasProps {
  id?: number;
  cnpj?: string;
  razao_social?: string;
  nome_fantasia?: string;
  descricao?: string;
  email?: string;
  telefone?: string;
  area_de_atuacao?: string;
  ativo?: boolean;
  data_cadastro?: string;
  cidade?: string;
  uf?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  website?: string;
  senha?: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginProps>({});
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    if (localStorage.getItem('empresa')) {
      navigate('/');
      return;
    }
  }, [navigate])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { // Remove HTMLTextAreaElement
    setError(false);
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const Fetch = async () => {
      try {
        const response = await axios.get('http://localhost:8080/empresas'); 
        const empresa: EmpresasProps[] = response.data.filter((item: EmpresasProps) => item.email === loginData.email);       

        if (empresa.length == 0 || empresa[0].senha !== loginData.senha) {
          setError(true) 
          return;         
        }

        localStorage.setItem('empresa', JSON.stringify(empresa[0]));
        navigate('/');
   
      } catch (error) {
        console.log(`Erro ao buscar os dados da empresa: ${error}`);
      }
    }
    Fetch();  
  };

  return (
    <Container>
      <h1>Entrar na sua conta</h1>

      <form onSubmit={handleSubmit}>
        <div className="group">
          <div>
            <label htmlFor="email">E-mail</label>
            {error ? <span>E-mail ou senha incorretos</span> : <></>}
          </div>
          <input type="email" id="email" name="email" placeholder="Digite seu e-mail" value={loginData?.email} onChange={handleChange}/>
        </div>

        <div className="group">
          <label htmlFor="senha">Senha</label>
          <input type="password" id="senha" name="senha" placeholder="Digite sua senha" value={loginData?.senha} onChange={handleChange}/>
        </div>

        <div className="info-extra">
          <div className="group check">
            <label htmlFor="manterConectado">Manter conectado?</label>
            <input type="checkbox" name="manterConectado" id="manterConectado" />
          </div>

          {/* <Link to='#'>Esqueceu a senha?</Link> */}
        </div>       

        <button>Entrar</button>
      </form>

      <div className="cadastro">
        <div className="separacao">
          <span className="line"></span>
          <p>ou</p>
          <span className="line"></span>
        </div>

        <Link to='/cadastrar'>Quero criar um conta!</Link>
      </div>

    </Container>
  )
}

export default Login