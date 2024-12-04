import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import { Cadastrar } from './pages/Cadastrar'
import { Vagas } from './pages/Vagas'
import CadastroVaga from './pages/CadastroVaga'
import { AlterarDados } from './pages/AlterarDados'
import { PerfilEmpresa } from './pages/PerfilEmpresa'
import { EditarVaga } from './pages/EditarVaga'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cadastrar' element={<Cadastrar />} />
          <Route path='/vagas/:empresa?' element={<Vagas />} />
          <Route path='/cadastroVagas' element={<CadastroVaga />} /> 
          <Route path='/alterarDados/:cpnj' element={<AlterarDados />} />
          <Route path='/perfil/:cnpj' element={<PerfilEmpresa />} />
          <Route path='/editarVaga/:id' element={<EditarVaga />} />
        </Route>
      </Routes>
  </BrowserRouter>
  )
}

export default App
