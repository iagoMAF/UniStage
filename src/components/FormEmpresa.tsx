import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AlertaFeedback } from './AlertaFeedback';
import { Link, useParams } from 'react-router-dom';

const FormEmp = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 40px;
  gap: 25px;

  p.error {
    color: red;
    font-size: 12px;
    position: relative;

    &::after {
      content:'*';
    }
  }

  .agrupar {
    width: 100%;
    display: flex;
    align-items: end;
    gap: 15px;
  }

  .group {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;

    &.w-45 {
      width: 45%;
    }
    &.w-50 {
      width: 50%;
    }
    &.w-75 {
      width: 75%;
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

    input, textarea {
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

    textarea {
      width: 100% !important;
      resize: none;
    }
  }

  button, a {
    display: block;
    text-decoration: none;
    align-items: center;
    width: 100%;
    background: #2C48FF;
    padding: 10px;
    border-radius: 9px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center !important;
    cursor: pointer;
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

interface ErrorProps {
  [fieldName: string]: string | undefined;
}

interface AlertaProps {
  mensagem?: string;
  error?: boolean;
}

export const FormEmpresa = () => {
  const [empresa, setEmpresa] = useState<EmpresasProps>({});
  const [confirmarSenha, setConfirmarSenha] = useState<string>('');
  const [error, setError] = useState<ErrorProps | null>(null);
  const Param = location.pathname;
  const [feedback, setFeedback] = useState<boolean>(false);
  const [alertaMsg, setAlertaMsg] = useState<AlertaProps>({});
  const [rota, setRota] = useState<string>('/login');

  useEffect(() => {    
    if (Param.includes('alterarDados') && localStorage.getItem('empresa')) {
      const empresaData = JSON.parse(localStorage.getItem('empresa') || '{}');
      setEmpresa(empresaData);
    }
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { // Remove HTMLTextAreaElement
    const { name, value } = event.target;    
    setEmpresa((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  };

  const handleChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEmpresa((prevData) => ({
     ...prevData,
      [name]: value,
    }));

    setError((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const requiredFields = [
      { field: 'nome_fantasia', message: 'O nome da empresa é obrigatório.' },
      { field: 'razao_social', message: 'A razão social é obrigatória.' },
      { field: 'cnpj', message: 'O CNPJ da empresa é obrigatório.' },
      { field: 'email', message: 'O e-mail da empresa é obrigatório.' },
      { field: 'descricao', message: 'A descrição da empresa é obrigatória.' },
      { field: 'telefone', message: 'O telefone da empresa é obrigatório.' },
      { field: 'area_de_atuacao', message: 'A área de atuação da empresa é obrigatória.' },
      { field: 'logradouro', message: 'O logradouro da empresa é obrigatório.' },
      { field: 'bairro', message: 'O bairro da empresa é obrigatório.' },
      { field: 'cidade', message: 'A cidade da empresa é obrigatória.' },
      { field: 'uf', message: 'O estado da empresa é obrigatório.' },
    ];

    const newErrors: ErrorProps = {};

    for (const field of requiredFields) {
      if (!empresa?.[field.field]) {
        newErrors[field.field] = field.message;
      }
    }

    if (empresa?.senha !== confirmarSenha) {
      newErrors.senha = "As senhas não coincidem.";
    }

    setError(newErrors);
    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1; // Mês começa em 0 (janeiro)
    const ano = dataAtual.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;

    if (Object.keys(newErrors).length == 0) {
      setEmpresa((prevData) => ({
        ...prevData,
        ativo: true,
        data_cadastro: dataFormatada,
      }))

      if (Param.includes('alterarDados')) {
        
        try {
          const cnpj = empresa.cnpj;
          setRota(`/perfil/${empresa.nome_fantasia}?id=${empresa.id}`)
          
          await axios.patch(`http://localhost:8080/empresas/${cnpj}`, JSON.stringify(empresa));
          
          if (localStorage.getItem('empresa')) {
            localStorage.removeItem('empresa');
            localStorage.setItem('empresa', JSON.stringify(empresa));
          }
  
          setAlertaMsg({
            mensagem: 'Empresa alterada com sucesso!',
            error: false,
          });
          setFeedback(true);  
        } catch (error) {
          setAlertaMsg({
            mensagem: 'Falha ao alterar os dados.',
            error: true,
          });
          if (axios.isAxiosError(error)) {
            console.error('Erro ao atualizar dados empresa:', error.response?.data || error.message);
            setError({ general: 'Erro ao atualizar dados empresa. Por favor, tente novamente.' }); 
          } else {
            console.error('Erro inesperado:', error);
            setError({ general: 'Erro inesperado. Por favor, tente novamente.' });
          }
        }
      } else {
        try {

          console.log(JSON.stringify(empresa));
          
          await axios.post('http://localhost:8080/empresas', JSON.stringify(empresa)); 
  
          setAlertaMsg({
            mensagem: 'Empresa cadastrada com sucesso!',
            error: false,
          });
          setFeedback(true);
        } catch (error) {
          setAlertaMsg({
            mensagem: 'Falha ao realizar o cadastro.',
            error: true,
          });
          if (axios.isAxiosError(error)) {
            console.error('Erro ao cadastrar empresa:', error.response?.data || error.message);
            setError({ general: 'Erro ao cadastrar empresa. Por favor, tente novamente.' }); 
          } else {
            console.error('Erro inesperado:', error);
            setError({ general: 'Erro inesperado. Por favor, tente novamente.' });
          }
        }
      }
      
    }    
  };

  return (
    <>
      {feedback ? <AlertaFeedback mensagem={alertaMsg.mensagem} error={alertaMsg.error} rota={rota} setAlerta={setFeedback} /> : <></>}

      <FormEmp onSubmit={handleSubmit}>
        <div className="group">
          {error?.nome_fantasia && <p className='error'>{error?.nome_fantasia}</p>}
          <label htmlFor="Nome">Nome da Empresa</label>
          <input type="text" 
                id='Nome' 
                name='nome_fantasia' 
                placeholder='Nome da Empresa' 
                value={empresa?.nome_fantasia} 
                onChange={handleChange}/>
        </div>

        <div className="group">
        {error?.razao_social && <p className='error'>{error?.razao_social}</p>}
          <label htmlFor="razaoSocial">Razão Social</label>
          <input type="text" 
                id='razaoSocial' 
                name="razao_social" 
                placeholder='Razão Social'
                value={empresa?.razao_social} 
                onChange={handleChange}/>
        </div>

        <div className="agrupar">
          <div className="group w-45">
            {error?.cnpj && <p className='error'>{error?.cnpj}</p>}
            <label htmlFor="cnpj">CNPJ</label>
            <input type="text" 
                  id='cnpj' 
                  name="cnpj" 
                  placeholder='CNPJ' 
                  value={empresa?.cnpj} 
                  onChange={handleChange}/>
          </div>

          <div className="group">
            {error?.email && <p className='error'>{error?.email}</p>}
            <label htmlFor="email">E-mail</label>
            <input type="email" 
                  id='email' 
                  name="email" 
                  placeholder='E-mail' 
                  value={empresa?.email} 
                  onChange={handleChange}/>
          </div>
        </div>

        <div className="group">
          {error?.descricao && <p className='error'>{error?.descricao}</p>}
          <label htmlFor="descricao">Descrição</label>
          <textarea name="descricao" 
                    id="descricao" 
                    rows={10} 
                    value={empresa?.descricao} 
                    onChange={handleChangeTextArea}></textarea>
        </div>

        <div className="agrupar">
          <div className="group">
            {error?.website && <p className='error'>{error?.website}</p>}
            <label htmlFor="site">Link do Site</label>
            <input type="text" 
                  id='site' 
                  name="website" 
                  placeholder='Link do Site' 
                  value={empresa?.website} 
                  onChange={handleChange} />
          </div>

          <div className="group w-45">
            {error?.telefone && <p className='error'>{error?.telefone}</p>}
            <label htmlFor="telefone">Telefone</label>
            <input type="text" 
                  id='telefone' 
                  name="telefone" 
                  placeholder='Telefone' 
                  value={empresa?.telefone} 
                  onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          {error?.area_de_atuacao && <p className='error'>{error?.area_de_atuacao}</p>}
          <label htmlFor="areaAtuacao">Área de Atuação</label>
          <input type="text"
                id='areaAtuacao'
                name="area_de_atuacao" 
                placeholder='Área de Atuação' 
                value={empresa?.area_de_atuacao} 
                onChange={handleChange} />
        </div>

        <div className="agrupar">
          <div className="group">
            {error?.logradouro && <p className='error'>{error?.logradouro}</p>}
            <label htmlFor="logradouro">Logradouro</label>
            <input type="text" 
                  id='logradouro' 
                  name="logradouro" 
                  placeholder='Logradouro' 
                  value={empresa?.logradouro} 
                  onChange={handleChange} />
          </div>

          <div className="group w-45">
            {error?.numero && <p className='error'>{error?.numero}</p>} 
            <label htmlFor="numero">Número</label>
            <input type="text" 
                  id='numero' 
                  name="numero" 
                  placeholder='Número' 
                  value={empresa?.numero} 
                  onChange={handleChange} />
          </div>
        </div>

        <div className="group">
          {error?.bairro && <p className='error'>{error?.bairro}</p>}
          <label htmlFor="bairro">Bairro</label>
          <input type="text" 
                  id='bairro' 
                  name="bairro" 
                  placeholder='Bairro' 
                  value={empresa?.bairro} 
                  onChange={handleChange} />
        </div>

        <div className="agrupar">
          <div className="group">
            {error?.cidade && <p className='error'>{error?.cidade}</p>}
            <label htmlFor="cidade">Cidade</label>
            <input type="text" 
                  id='cidade' 
                  name="cidade" 
                  placeholder='Cidade' 
                  value={empresa?.cidade} 
                  onChange={handleChange} />
          </div>

          <div className="group w-45">
            {error?.uf && <p className='error'>{error?.uf}</p>}
            <label htmlFor="estado">Estado</label>
            <input type="text" 
                  id='estado' 
                  name="uf"
                  maxLength={2} 
                  placeholder='Estado' 
                  value={empresa?.uf} 
                  onChange={handleChange} />
          </div>
        </div>

        <div className="agrupar">
          <div className="group">
            {error?.senha && <p className='error'>{error?.senha}</p>}
            <label htmlFor="senha">Senha</label>
            <input type="password" 
                  id='senha' 
                  name="senha" 
                  placeholder='Senha' 
                  value={empresa?.senha} 
                  onChange={handleChange} />
          </div>
          <div className="group">
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input type="password"
                  id='confirmarSenha' 
                  placeholder='Confirmar Senha' 
                  value={confirmarSenha} 
                  onChange={(e) => setConfirmarSenha(e.target.value)} />
          </div>
        </div>

        {Param.includes('cadastrar') ? <button>Cadastrar</button> : 
        <>
          <div className="agrupar">
            <button>Salvar</button>
            <Link to='/'>Cancelar</Link>
          </div>
        </>}
        
      </FormEmp>
    </>
  )
}
