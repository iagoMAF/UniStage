import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import styled from 'styled-components'
import { useSearch } from './SearchContext';


const Container = styled.div`
  width: 100%;
  left: 0;
  padding: 15px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(0,0,0, .4);
  box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
  background: #fff;
  position: relative;

  input, select {
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 18px;
    border-radius: 50px;
  }

  input {
    max-width: 700px;
    width: 100%;
  }

  select {
    max-width: 175px;
    width: 100%;
    padding-right: 30px;
  }
`

export const SubHeader = () => {
  const { empresa } = useParams();
  const { searchTerm ,setSearchTerm, selectTipo, setSelectTipo } = useSearch();

  useEffect(() => {
    setSearchTerm(empresa)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const handleSelectTipo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectTipo(e.target.value);
  }

  return (
    <Container>
      {empresa ? <h1>Minhas Vagas</h1> : <h1>Vagas</h1>}
      <input type='text' placeholder='Pesquisar por empresa ou vaga' onChange={handleSearch} value={searchTerm} />

      <select onChange={handleSelectTipo} name="tipoVaga" id="tipoVaga">
        <option value="" disabled>Selecione um tipo</option>
        <option value="">Todos</option>
        <option value="1">Remoto</option>
        <option value="2">Hibrido</option>
        <option value="0">Presencial</option>
      </select>

    </Container>
  )
}
