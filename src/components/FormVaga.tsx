import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AlertaFeedback } from './AlertaFeedback';
import { Link, useParams } from 'react-router-dom';

const FormVagaStyle = styled.form`
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

    &.space-between {
      justify-content: space-between;
    }
  }

  .group {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 5px;

    &.w-25 {
      width: 25%;
    }
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

    input, textarea, select {
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

interface VagaProps {
  id?: number;
  ativo: true,
  bairro: string,
  beneficios: string,
  carga_horaria: string,
  cidade: string,
  conhecimento_dif: string,
  data_expiracao: string,
  data_publicacao: string,
  descricao: string,
  empresa_cnpj: string,
  estagio_remoto: number,
  logradouro: string,
  numero: string,
  remuneracao: string,
  requisitos: string,
  titulo: string,
  uf: string
  area_de_atuacao: string,
  empresa: {
    cnpj: string,
		razao_social: string,
		email: string,
		telefone: string,
		area_de_atuacao: string,
		ativo: boolean,
		cidade: string,
		uf: string,
		logradouro: string,
		numero: string,
		bairro: string,
		senha: string,
  }
}

interface ErrorProps {
  [fieldName: string]: string | undefined;
}

interface AlertaProps {
  mensagem?: string;
  error?: boolean;
}

export const FormVaga = () => {
  const [vaga, setVaga] = useState<VagaProps>({});
  const [cnpj, setCnpj] = useState<string>('');
  const [error, setError] = useState<ErrorProps | null>(null);
  const Param = location.pathname;
  const [feedback, setFeedback] = useState<boolean>(false);
  const [alertaMsg, setAlertaMsg] = useState<AlertaProps>({});
  const [rota, setRota] = useState<string>('/vagas');
  const [tipoEstagio, setTipoEstagio] = useState<string>('1');    
  const { id } = useParams(); 

  useEffect(() => {    
    const empresaData = JSON.parse(localStorage.getItem('empresa') || '{}');
    setCnpj(empresaData.cnpj);

    if (Param.includes('editarVaga')) {         
      const Fetch = async () => {
        const response = await axios.get(`http://localhost:8080/vagas/${id}`);
        setVaga(response.data)    
      };
      Fetch();
    }
  }, [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { // Remove HTMLTextAreaElement
    const { name, value } = event.target;    
    setVaga((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  };

  const handleChangeTextArea = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setVaga((prevData) => ({
     ...prevData,
      [name]: value,
    }));

    setError((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  }

  const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    
    setTipoEstagio(value)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const requiredFields = [
      { field: 'carga_horaria', message: 'A caraga horária da vaga é obrigatório.' },
      { field: 'remuneracao', message: 'A remuneração da vaga é obrigatório.' },
      { field: 'conhecimento_dif', message: 'A descrição da vaga é obrigatória.' },
      { field: 'data_expiracao', message: 'A data final da vaga é obrigatório.' },
      { field: 'descricao', message: 'A descrição da vaga é obrigatório.' },
    ];

    const requiredFieldsPresencial = [
      { field: 'bairro', message: 'O bairro é obrigatório.' },
      { field: 'logradouro', message: 'O logradouro é obrigatória.' },
      { field: 'cidade', message: 'A cidade é obrigatória.' },
      { field: 'uf', message: 'O estado é obrigatório.' },
    ];

    const newErrors: ErrorProps = {};

    for (const field of requiredFields) {
      if (!vaga?.[field.field]) {
        newErrors[field.field] = field.message;
      }
    }

    // 0 = Presencial, 1 = Remoto, 2 = Híbrido

    if (tipoEstagio == '') {
      newErrors['estagio_remoto'] = 'O tipo de estágio da vaga é obrigatório.';
    }
    
    if (tipoEstagio !== '1') {
      for (const field of requiredFieldsPresencial) {
        if (!vaga?.[field.field]) {
          newErrors[field.field] = field.message;
        }
      }
    }

    setError(newErrors);  
    if (Object.keys(newErrors).length == 0) {
      const empresaData = JSON.parse(localStorage.getItem('empresa') || '{}');
      if (Param.includes('editarVaga')) {   
        const vagaData = {
          ...vaga,
          ativo: true,
          estagio_remoto: Number(tipoEstagio),
          empresa: empresaData
        }
        try {
          setRota(`/vagas/${vaga.titulo}`)
          
          await axios.patch(`http://localhost:8080/vagas/${id}`, JSON.stringify(vagaData));
  
          setAlertaMsg({
            mensagem: 'Vaga alterada com sucesso!',
            error: false,
          });
          setFeedback(true);  
        } catch (error) {
          setAlertaMsg({
            mensagem: 'Falha ao alterar os dados.',
            error: true,
          });
          if (axios.isAxiosError(error)) {
            console.error('Erro ao atualizar dados vaga:', error.response?.data || error.message);
            setError({ general: 'Erro ao atualizar dados vaga. Por favor, tente novamente.' }); 
          } else {
            console.error('Erro inesperado:', error);
            setError({ general: 'Erro inesperado. Por favor, tente novamente.' });
          }
        }
      } else {
          try {  
            const vagaData = {
              ...vaga,
              ativo: true,
              estagio_remoto: Number(tipoEstagio),
              empresa_cnpj: empresaData.cnpj
            }
               
            await axios.post('http://localhost:8080/vagas', JSON.stringify(vagaData)); 
    
            setAlertaMsg({
              mensagem: 'Vaga cadastrada com sucesso!',
              error: false,
            });
            setFeedback(true);
          } catch (error) {
            setAlertaMsg({
              mensagem: 'Falha ao realizar o cadastro.',
              error: true,
            });
            if (axios.isAxiosError(error)) {
              console.error('Erro ao cadastrar vaga:', error.response?.data || error.message);
              setError({ general: 'Erro ao cadastrar vaga. Por favor, tente novamente.' }); 
            } else {
              console.error('Erro inesperado:', error);
              setError({ general: 'Erro inesperado. Por favor, tente novamente.' });
            }
          }
        }
      }  
    }           
  ;

  return (
    <>
      {feedback ? <AlertaFeedback mensagem={alertaMsg.mensagem} error={alertaMsg.error} rota={rota} setAlerta={setFeedback} /> : <></>}

      <FormVagaStyle onSubmit={handleSubmit}>
        <div className="group">
          {error?.titulo && <p className='error'>{error?.titulo}</p>}
          <label htmlFor="tituloVaga">Título da Vaga</label>
          <input type="text"
                id='tituloVaga' 
                name='titulo'
                placeholder='Título da Vaga' 
                value={vaga?.titulo} 
                onChange={handleChange} />
        </div>

        <div className="agrupar">
          <div className="group">
            {error?.areaAtuacao && <p className='error'>{error?.areaAtuacao}</p>}
            <label htmlFor="areaAtuacao">Área de Atuação</label>
            <input type="text"
                  id='areaAtuacao' 
                  name='area_de_atuacao'
                  placeholder='Área de Atuação' 
                  value={vaga?.area_de_atuacao} 
                  onChange={handleChange} />
          </div>
          
          <div className="group">
            {error?.data_expiracao && <p className='error'>{error?.data_expiracao}</p>}
            <label htmlFor="DataFinal">Data Final</label>
            <input type="date"
                  id='DataFinal' 
                  name='data_expiracao'
                  placeholder='Data Final' 
                  value={vaga?.data_expiracao} 
                  onChange={handleChange} />
          </div>
        </div>

        <div className="agrupar">
          <div className="group">
            {error?.semestreMin && <p className='error'>{error?.semestreMin}</p>}
            <label htmlFor="semestreMin">Semestre Mínimo</label>
            <input type="text"
                  id='semestreMin' 
                  name='semestreMin'
                  placeholder='Semestre Mínimo' />
          </div>

          <div className="group">
            {error?.remuneracao && <p className='error'>{error?.remuneracao}</p>}
            <label htmlFor="ValorBolsa">Valor da Bolsa</label>
            <input type="text"
                  id='ValorBolsa' 
                  name='remuneracao'
                  placeholder='Valor da Bolsa' 
                  value={vaga?.remuneracao} 
                  onChange={handleChange} />
          </div>
        </div>
        
        <div className="agrupar">
          <div className="group">
            {error?.conhecimento_dif && <p className='error'>{error?.conhecimento_dif}</p>}
            <label htmlFor="conhecimento">Conhecimento Diferencial</label>
            <input type="text"
                  id='conhecimento' 
                  name='conhecimento_dif'
                  placeholder='Conhecimento Diferencial' 
                  value={vaga?.conhecimento_dif} 
                  onChange={handleChange} />
          </div>

          <div id="conhecimento"></div>        
        </div>

        <div className="group">
          {error?.descricao && <p className='error'>{error?.descricao}</p>}
          <label htmlFor="descricao">Descrição</label>
          <textarea name="descricao" 
                      id="descricao" 
                      rows={10} 
                      value={vaga?.descricao} 
                      onChange={handleChangeTextArea}></textarea>
        </div>

        {/* validação para alterar para remoto e presencial */}

        <div className="agrupar space-between">
          <div className="group w-25">
            {error?.tipoEstagio && <p className='error'>{error?.tipoEstagio}</p>}
              <label htmlFor="tipoEstagio">Tipo do Estágio</label>
              <select name="tipoEstagio" id="tipoEstagio" onChange={handleChangeSelect}>
                <option value="" disabled>Seleciona um tipo</option>
                <option value={'1'}>Remoto</option>
                <option value={'2'}>Hibrido</option>
                <option value={'0'}>Presencial</option>
              </select>
            </div>

            <div className="group w-25">
              {error?.carga_horaria && <p className='error'>{error?.carga_horaria}</p>}
              <label htmlFor="cargaHoraria">Carga Horária</label>
              <input type="time"
                    id='cargaHoraria' 
                    name='carga_horaria'
                    placeholder='Carga Horária' 
                    value={vaga?.carga_horaria} 
                    onChange={handleChange} />
          </div>
        </div>

        { tipoEstagio != '1' ? 
          <>
            <div className="agrupar">
            <div className="group">
              {error?.logradouro && <p className='error'>{error?.logradouro}</p>}
              <label htmlFor="logradouro">Logradouro</label>
              <input type="text"
                    id='logradouro' 
                    name='logradouro'
                    placeholder='Logradouro' 
                    value={vaga?.logradouro} 
                    onChange={handleChange} />
            </div>

            <div className="group">
              <label htmlFor="numero">Número</label>
              <input type="text"
                    id='numero' 
                    name='numero'
                    placeholder='Número' 
                    value={vaga?.numero} 
                    onChange={handleChange} />
            </div>
          </div>

          <div className="group">
              {error?.bairro && <p className='error'>{error?.bairro}</p>}
              <label htmlFor="bairro">Bairro</label>
              <input type="text"
                    id='bairro' 
                    name='bairro'
                    placeholder='Bairro' 
                    value={vaga?.bairro} 
                    onChange={handleChange} />
            </div>

          <div className="agrupar">
            <div className="group">
              {error?.cidade && <p className='error'>{error?.cidade}</p>}
              <label htmlFor="cidade">Cidade</label>
              <input type="text"
                    id='cidade' 
                    name='cidade'
                    placeholder='Cidade' 
                    value={vaga?.cidade} 
                    onChange={handleChange} />
            </div>

            <div className="group">
              {error?.estado && <p className='error'>{error?.estado}</p>}
              <label htmlFor="estado">Estado</label>
              <input type="text"
                    id='estado' 
                    name='estado'
                    placeholder='Estado' 
                    value={vaga?.uf} 
                    onChange={handleChange} />
            </div>          
          </div>      
        </>
        : <></>
        }

        {Param.includes('cadastro') ? <button>Cadastrar</button> : 
        <>
          <div className="agrupar">
            <button>Salvar</button>
            <Link to='/'>Cancelar</Link>
          </div>
        </>}
        
      </FormVagaStyle>
    </>
  )
}
