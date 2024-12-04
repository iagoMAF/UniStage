import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 328px;

  p {
    font-size: 18px;
    font-weight: bold;
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    width: 60px;
    aspect-ratio: 2;
    --_g: no-repeat radial-gradient(circle closest-side,#000 90%,#0000);
    background: 
      var(--_g) 0%   50%,
      var(--_g) 50%  50%,
      var(--_g) 100% 50%;
    background-size: calc(100%/3) 50%;
    animation: l3 1s infinite linear;
  }
  @keyframes l3 {
      20%{background-position:0%   0%, 50%  50%,100%  50%}
      40%{background-position:0% 100%, 50%   0%,100%  50%}
      60%{background-position:0%  50%, 50% 100%,100%   0%}
      80%{background-position:0%  50%, 50%  50%,100% 100%}
  }

`
interface MensagemProps {
  mensagem: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Enviando: React.FC<MensagemProps> = ({mensagem, setModal}) => {
  useEffect(() => {
    if (mensagem !== '') {
      setTimeout(() => {
        setModal(false)
      }, 2000)
    }
  }, [mensagem])

  return (
    <Container>
      {mensagem != '' ? 
        <p>{mensagem}</p> 
      :
        <>
          <p>Enviando</p>
          <div className='loader'></div>
        </>
      }        
    </Container>
  )
}
