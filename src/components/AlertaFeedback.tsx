import styled from 'styled-components';
import Sucess from '../assets/Images/Sucess.svg'
import Error from '../assets/Images/Error.svg'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0000005a;
  z-index: 99999;

  .alerta {
    background: #fff;
    border-radius: 100px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;

    p {
      font-weight: bold;
    }

    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
  }
`

interface AlertaProps {
  mensagem?: string;
  rota: string;
  error?: boolean;
  setAlerta: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AlertaFeedback = ({mensagem, error, rota, setAlerta}: AlertaProps) => {
  const Navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({
      top: 0,
    });

    setTimeout(() => {
      setAlerta(false)
      return Navigate(rota);
    }, 3000)
  }, [])


  return (
    <Container>
      <div className="alerta">
        <p>{mensagem}</p>
        <img src={error ? Error : Sucess} alt="Icone de notificação" />
      </div>
    </Container>
  )
}
