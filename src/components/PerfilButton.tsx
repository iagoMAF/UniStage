import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Content = styled.li`
  position: relative;

  p {
    display: block;
    background: #2C48FF;
    padding: 4px 11px;
    border-radius: 8px;
    color: #fff; 
    transition: background .1s linear;    
    cursor: pointer;

    &:hover {
      background: #1c33c9;
    }
  }

  ul {
    display: none !important;
    position: absolute !important;
    right: 0 !important;
    width: max-content !important;
    flex-direction: column !important;
    align-items: end !important;
    justify-content: start !important;
    background: #1c33c9 !important;
    font-size: 14px !important;
    gap: 5px !important;
    padding: 10px !important;
    border-radius: 10px 0 10px 10px !important;
    z-index: 9999 !important;

    li a {
      color: #fff;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &.ativo {
    p {
      border-radius: 10px 10px 0 0;
    }

    ul {
      display: flex !important;
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

export const PerfilButton = () => {
  const [clicou, setClicou] = useState<boolean>(false);
  const [empresa , setEmpresa] = useState<EmpresasProps>({});
  const navigate = useNavigate();

  const handleClick = () => {
    setClicou(!clicou)
  }

  const handleLogout = () => {    
    localStorage.removeItem('empresa');
  }

  useEffect(() =>{
    setClicou(false)
  }, [navigate])

  useEffect(() => {
    if (localStorage.getItem('empresa')) {
      setEmpresa(JSON.parse(localStorage.getItem('empresa')!));   
    }
  }, [])

  return (
    <Content className={clicou ? 'ativo' : ''}>
      <p className='button' onClick={handleClick}>Meu Perfil</p>
      <ul>
        <li><Link to={`/perfil/${empresa.nome_fantasia}?id=${empresa.id}`}>Meu Perfil</Link></li>
        <li><Link to={`/alterarDados/${empresa.cnpj}`}>Alterar meus dados</Link></li>
        <li><Link to={`/vagas/${empresa.nome_fantasia}`}>Minhas Vagas Disponíveis</Link></li>
        <li><Link to={'/cadastroVagas'}>Ofertar Vagas</Link></li>
        <li><Link to={`/vagas/${empresa.nome_fantasia}`}>Editar Vagas</Link></li>
        <li><Link to={'/login'} onClick={handleLogout}>Sair</Link></li>
      </ul>
    </Content>
  )
}
