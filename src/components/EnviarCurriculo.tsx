import styled from 'styled-components'
import emailjs from '@emailjs/browser'
import { useState } from 'react';
import Close from  '../assets/Images/close.png'
import { Enviando } from './Enviando';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100dvh;
  top: 0;
  left: 0;
  background: #0000006f;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal {
    position: relative;
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
    max-width: 80%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 100;
    min-height: 388px;

    h1 {
      font-size: 30px;
    }

    .close {
      width: 35px;
      height: 35px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .group {
      display: flex;
      flex-direction: column;

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .error {
        color: red;
        font-size: 13px;
      }
      }

      input {
        background: #fff;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.5);
        padding: 5px 10px;

      }

      input[type=file] {
        border: none;
      }
    }
  }
`

interface DadosProps {
  nome: string;
  email: string;
  arquivo?: File | null;
}

interface DadosEmpresaProps {
  nome: string;
  email: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DadosErrorProps {
  [fieldName: string]: string | undefined;
}

export const EnviarCurriculo: React.FC<DadosEmpresaProps> = ({nome, email, setOpenModal}) => {
  const [dados, setDados] = useState<DadosProps>({nome:'', email: '', arquivo: null});
  const [enviando, setEnviando] = useState<boolean>(false);
  const [error, setError] = useState<DadosErrorProps | null>({});
  const [feedBack, setFeedback] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDados({...dados, [name]: value});
    setError((prevErrors) => ({...prevErrors, [name]: undefined }));
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback('')

    // Verificando os campos se foram preenchidos
    const requiredFields = [
      { field: 'nome', message: 'O nome é obrigatório.' },
      { field: 'email', message: 'O e-mail é obrigatória.' },
      // { field: 'arquivo', message: 'O currículo é obrigatória.' },
    ];

    const newErrors: DadosErrorProps = {};

    for (const field of requiredFields) {
      if (!dados?.[field.field]) {
        newErrors[field.field] = field.message;
      }
    }

    setError(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      return
    }

    setEnviando(true);

    const templateParams = {
      to_name: nome, // Nome da empresa
      from_name: dados?.nome, // Nome do usuário
      message: 'Segue em anexo o currículo', // PDF
      email: dados?.email, // email do usuário
      empresa_email: email, // e-mail que vai receber
    }

    console.log(templateParams);
    

    emailjs.send('service_kmzjvw4', 'template_lasermh', templateParams, 'SFdnC5cwk4mel-GUN')
    .then((response) => {
      setFeedback('Currículo enviado')    
    }, (error) => {
      console.log(`Error: ${error}`);     
      setFeedback('Erro ao enviar o currículo')
    })
  }

  return (
    <Container>
      <div className="modal">
        {enviando ? <Enviando mensagem={feedBack} setModal={setEnviando} /> 
        :
          <>
            <img className='close' onClick={() => setOpenModal(false)} src={Close} alt="ícone de fechar" />

            <h1>Envie seu currículo</h1>
            <form onSubmit={(event) => {handleSubmit(event)}}>
              <div className="group">
                <div>
                  <label htmlFor="nome">Nome Completo</label>
                  {error?.nome && <p className='error'>{error?.nome}</p>}
                </div>
                <input type="text" id="nome" name="nome" placeholder="Digite seu nome" value={dados?.nome} onChange={handleChange} />
              </div>

              <div className="group">
                <div>
                  <label htmlFor="email">E-mail</label>
                  {error?.email && <p className='error'>{error?.email}</p>}
                </div>
                <input type="email" id="email" name="email" placeholder="Digite seu e-mail" value={dados?.email} onChange={handleChange}/>
              </div>

              <div className="group">
                <div>
                  <label htmlFor="curriculo">Envie seu documento</label>
                  {error?.arquivo && <p className='error'>{error?.arquivo}</p>}
                </div>
                <input type="file" id="curriculo" name="curriculo"/>
              </div>

              <button type="submit">Enviar</button>
            </form>
          </>
        }        
      </div>
    </Container>
  )
}
