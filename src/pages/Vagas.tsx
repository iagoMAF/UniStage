import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components"
import { useSearch } from "../components/SearchContext";
import { EnviarCurriculo } from "../components/EnviarCurriculo";

const Container = styled.div`
  background: #fff;
  margin-top: 2px;
  padding: 10px 0px 0px 20px;
  display: flex;
  min-height: calc(100dvh - 151.5px);

  .lista-vagas {
    padding: 0 10px 0 5px;
    max-width: 600px;
    width: 100%;
    max-height: 770px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 10px;    
  }

  .mostra-vaga {
    max-width: 620px;
    width: 100%;
    padding: 20px;
    max-height: calc(100dvh - 151.5px);
    overflow-y: scroll;


    .cabecalho {
      display: flex;
      flex-direction: column;
      gap: 10px;

      a {
        font-size: 30px;
        opacity: .8;
        z-index: 1;
        font-weight: bold;
      }

      h4 {
        font-size: 25px;
        font-weight: bold;
      }

      .descricao {
        font-size: 18px;
      }

      .tipoVaga {
        width: fit-content;
        display: block;
        background: #D0D0D0;
        padding: 5px 10px;
        border-radius: 10px;
      }

      margin-bottom: 35px; 
    }

    .detalheVaga {
      font-size: 18px;
    }
  }

  .nenhuma-vaga {
    font-weight: bold;
    margin-top: 20px;
    text-align: center;
  }

  button {
    background: #2C48FF;
    padding: 10px 20px;
    border-radius: 10px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    border: none;
    margin-top: 35px;
    cursor: pointer;
  }
`

const CardVaga = styled.div`
  max-width: 555px;
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &.ativo {
    border: 3px solid #20285045;
  }

  & >.imagem {
    width: 185px;
    height: 177px;
    border-radius: 10px;
    background: grey;
    overflow: hidden;
    background-size: cover;
    background-position: center;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 11px;
    font-size: 18px;

    .agrupar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 50px;
    }

    .area-atuacao {
      font-size: 16px;
      opacity: .75;
    }

    h2 {
      font-size: 22px;
    }

    span {
      margin-left: 20px;
    }

    .tipoVaga {
      width: fit-content;
      display: block;
      background: #D0D0D0;
      padding: 10px;
      border-radius: 10px;
    }
  }
`

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

interface EmailEmpresa {
  nome: string;
  email: string;
}

export const Vagas = () => {
  const [vagaAtiva, setVagaAtiva] = useState<number | null>(1);
  const [vagas, setVagas] = useState<VagasProps[]>([]);
  const [empresa, setEmpresa] = useState<EmpresasProps>({});
  const Navigate = useNavigate();
  const { searchTerm ,setSearchTerm, selectTipo, setSelectTipo } = useSearch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dadosEmpresa, setDadosEmpresa] = useState<EmailEmpresa>({nome: '', email: ''});
  const Params = useParams();

  useEffect(() =>  {
    if (localStorage.getItem('empresa')) {
      setEmpresa(JSON.parse(localStorage.getItem('empresa')!));
    }     
    
    const Fetch = async () => {
      const response = await axios.get('http://localhost:8080/vagas');  
      setVagas(response.data);
    }
    Fetch();
  }, [])

  const handleClick = (vaga: VagasProps) => {
    setVagaAtiva(vagaAtiva === vaga.id ? null : vaga.id); // Desativa se já estiver ativo
  };

  useEffect(() => {
    const Fetch = async () => {
      const response = await axios.get('http://localhost:8080/vagas');
      setVagas(response.data.filter((vaga : VagasProps) => (
        (vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase())) || 
         vaga.empresa.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setVagaAtiva(response.data[0].id)
    }
    Fetch();
  }, [searchTerm])

  useEffect(() => {
    const Fetch = async () => {
      const response = await axios.get('http://localhost:8080/vagas');
      if (selectTipo != '') {
        setVagas(response.data.filter((vaga : VagasProps) => String(vaga.estagio_remoto) == selectTipo)) 
      } else {
        setVagas(response.data)
      }            
    }
    Fetch();
  }, [selectTipo])

  const handleEdit = (id: number) => {
    return Navigate(`/editarVaga/${id}`);
  }

  const handleOpenModal = (id: number, nome: string, email: string) => {
    // Implementar a chamada para a API de envio de currículo para a vaga
    window.scrollTo({
      top: 0,
      left: 0,
    });

    setDadosEmpresa({nome: nome, email: email});
    setOpenModal(true);
  }


  return (
    <Container>
      {openModal ? <EnviarCurriculo nome={dadosEmpresa.nome} email={dadosEmpresa.email} setOpenModal={setOpenModal} /> : null}   

      <div className="lista-vagas">
        {vagas.length === 0 ? <p className="nenhuma-vaga">Nenhuma vaga encontrada...</p> 
        :
          vagas.map(vaga => (
            <CardVaga key={vaga.id} className={vaga.id == vagaAtiva ? 'ativo' : ''} onClick={() => handleClick(vaga)}>
              <img className="imagem" src="/src/assets/Images/sobre.jpg" alt="#" />

              <div className="info">
                <h2>{vaga.empresa.nome_fantasia}</h2>
                <p>{vaga.titulo}</p>
                <p className="area-atuacao">{vaga.area_de_atuacao}</p>
                <div className="agrupar">
                  <p className="tipoVaga">
                    {vaga.estagio_remoto == 0 ? 'Presencial' : vaga.estagio_remoto == 1 ? 'Remoto' : 'Híbrido'}
                  </p>
                </div>
              </div>          
            </CardVaga>  
          ))
        }
        
      </div>  

      <div className="mostra-vaga">
        {vagas
        .filter(vaga => vaga.id == vagaAtiva) // Filtra as vagas onde a empresa está ativa
        .map((vaga, index) => (
          <>
            <div key={index} className="cabecalho">
              <Link to={`/perfil/${vaga.empresa.cnpj}`}>{vaga.empresa.nome_fantasia}</Link>
              <h4>{vaga.titulo}</h4>
              <p className="descricao">Área de atuação: {vaga.area_de_atuacao}</p>
              <p className="tipoVaga">
                {vaga.estagio_remoto == 0 ? 'Presencial' : vaga.estagio_remoto == 1 ? 'Remoto' : 'Híbrido'}
              </p>
            </div>

            <div className="detalheVaga">
              <p>{vaga.descricao}</p>
            </div>

            {empresa && empresa.cnpj === vaga.empresa.cnpj ? 
              <button onClick={() => handleEdit(vaga.id)}>Editar Vaga</button>
            : 
              <button onClick={() => handleOpenModal(vaga.id, vaga.empresa.nome_fantasia, vaga.empresa.email)}>Enviar Curriculo</button>}
            {/* Pegar o cnpj da empresa e ver se é o mesmo da vaga */}
          </>
        ))}
      </div>
    </Container>
  )
}
