import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components'
import { Carregamento } from '../components/Carregamento';

const SobreContent = styled.section`
  margin-top: 44px;
  width: 100%;
  .cabecalho {    
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 35px;
    background: #f5f5f5;

    & > div {
      max-width: 436px;
      max-height: 462px;

      & img {
        max-width: inherit;
        max-height: inherit;
        border-radius: 20px;
      }
    }
  }

  .informacoes {
    max-width: 705px;

    h2 {
      font-size: 35px;
      margin-bottom: 15px;
    }

    p {
      font-size: 20px;
      &::first-letter {
        font-size: 35px;
        font-weight: bold;
      }
    }
  }
`

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

interface VagasProps {
  "id": number,
  "titulo": string,
  "descricao": string,
  "requisitos": string,
  "beneficios": string,
  "conhecimento_dif": string,
  "carga_horaria": string
  "remuneracao": string,
  "estagio_remoto": number,
  "cidade": string,
  "uf": string,
  "logradouro": string,
  "numero": string,
  "bairro": string,
  "empresa_cnpj": string,
  "ativo": true,
  "data_publicacao": string,
  "data_expiracao": string,
  "area_de_atuacao": string,
  "empresa": {
    "cnpj": string,
    "razao_social": string,
    "nome_fantasia": string,
    "descricao": string,
    "email": string,
    "telefone": string,
    "area_de_atuacao": string,
    "ativo": boolean,
    "data_cadastro": string,
    "cidade": string,
    "uf": string,
    "logradouro": string,
    "numero": string,
    "bairro": string,
    "website": string,
    "senha": string
  }
}


const VagasEmp = styled.section`
  margin-top: 74px;
  text-decoration: none;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
  margin-bottom: 45px;

  h3 {
    font-size: 35px;
  }

  a.button {
    max-width: 150px;
    text-decoration: none;
    display: inline-block;
    background: #2C48FF;
    padding: 8px 11px;
    border-radius: 8px;
    color: #fff; 
    transition: background .1s linear;

    &:hover {
      background: #1c33c9;
    }
  }

  .vagaContent {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
`

const CardVagas = styled.div`
  max-width: 555px;
  width: 100%;
  background: #fff;
  display: flex;
  padding: 10px 15px;
  border-radius: 10px;
  gap: 24px;
  cursor: pointer;
  
  img {
    max-width: 185px;
    max-height: 177px;
    background: grey;
    border-radius: 10px;
  }

  .content-vaga {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 11px;

    h4 {
      font-size: 22px;
      font-weight: 500;
    }

    p {
      font-size: 20px;

      &.estagio {
        margin-left: 15px;
        font-size: 20px;
      }

      &.remoto {
        background: #D0D0D0;
        padding: 5px 8px;
        border-radius: 10px;
        font-size: 18px;
      }
    }

  }
`

export const PerfilEmpresa = () => {
  const [empresaData, setEmpresaData] = useState<EmpresasProps>({})
  const { empresa } = useParams();
  const [idParams] = useSearchParams();
  const { cnpj } = useParams();
  const [vagas, setVagas] = useState<VagasProps[]>([])
  const Navigate = useNavigate();

  console.log(empresa, cnpj);

  useEffect(() => {
    const Fetch = async () => {
      try {        
        const response = await axios.get(`http://localhost:8080/empresas/${cnpj}`); 
        setEmpresaData(response.data);       
   
      } catch (error) {
        console.log(`Erro ao buscar os dados da empresa: ${error}`);
      }
    }
    Fetch();  

    const FetchVaga = async () => {
      try {        
        const response = await axios.get(`http://localhost:8080/vagas/cnpj/${cnpj}`); 
        setVagas(response.data);       

        console.log(response.data);
        
   
      } catch (error) {
        console.log(`Erro ao buscar as vagas da empresa: ${error}`);
      }
    }
    FetchVaga();
  }, [])
  
  if (!empresaData) {
    return <Carregamento />
  }

  const handleClick = (id: number) => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    return Navigate('/vagas')
  }

  return (
    <SobreContent id='sobre'>
    <div className="cabecalho">
      <div>
        <img src="/src/assets/Images/sobre.jpg" alt="Imagem sobre a empresa" />
      </div>
      <div className='informacoes'>
        <h2>{empresaData.nome_fantasia}</h2>
        <p>{empresaData.descricao}</p>
      </div>
    </div>

    <VagasEmp>
      <h3>Conheça as Vagas Disponíveis</h3>
      {vagas.length == 0 ? <Carregamento /> 
      : 
        <div className="vagaContent">

          {vagas.map((vaga) => (
            <CardVagas onClick={() => {handleClick(vaga.id)}}>
              <img src="/src/assets/Images/sobre.jpg" alt="Logo empresa" />
              <div className="content-vaga">
                <h4>{vaga.empresa.nome_fantasia}</h4>
                <p className="descricao">{vaga.titulo}</p>
                <p className="estagio">Estágio</p>                
                <p className="remoto">
                  {vaga.estagio_remoto == 0 ? 'Presencial' : vaga.estagio_remoto == 1 ? 'Remoto' : 'Híbrido'}
                </p>
              </div>
            </CardVagas>
          )).slice(0, 4)}
        </div>
      }
      <Link className="button" to='vagas'>Vejas Mais</Link>
    </VagasEmp>
  </SobreContent> 
  )
}
