import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { SubHeader } from './SubHeader';
import { PerfilButton } from './PerfilButton';
import { useEffect, useState } from 'react';

const Nav = styled.div`
  max-width: 100dvw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 60px;
  background: #fff;

  & div > a {
    font-size: 35px;
    font-weight: bold;
  }

  a {
    text-decoration: none;
  }
  
  ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 30px;

    li.login a {
      display: block;
      background: #2C48FF;
      padding: 4px 11px;
      border-radius: 8px;
      color: #fff; 
      transition: background .1s linear;

      &:hover {
        background: #1c33c9;
      }
    }
  }
`

const Navbar = () => {
  const [logado, setLogado] = useState<boolean>(false);
  const Params = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('empresa')) {
      setLogado(true);
    } else {
      setLogado(false);
    }
  }, [navigate]);

  return (
    <>
      <Nav>
        <div>
          <Link to="/">UniStage</Link>
        </div>

        <ul>
          <li>
            <Link to={Params != '/' ? "/#sobre" : '#sobre'}>Sobre</Link>
          </li>
          <li>
            <Link to="/vagas">Vagas</Link>
          </li>
          <li>
            <Link to={Params != '/' ? "/#empresas-parceiras" : '#empresas-parceiras'}>Empresas Parceiras</Link>
          </li>
          {!logado ? 
            <li className='login'>
              <Link to="/login">Faça parte do time</Link>
            </li>
          :          
            <PerfilButton/>
          }
        </ul>
      </Nav>

      {Params.includes('vagas') && <SubHeader/>}
    </>
  )
}

export default Navbar