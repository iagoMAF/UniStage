import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import styled from 'styled-components'
import { SearchProvider } from './SearchContext'

const MainContent = styled.main<MainContentProps>`
  max-width: 1200px;
  padding: 0 30px;
  margin: 0 auto;
  min-height:  ${({ minHeight }) => minHeight || 'calc(100vh - 271.5px)'};
`

interface MainContentProps {
  minHeight?: string;
}

const Layout = () => {
  const location = useLocation();
  let minHeight = 'calc(100vh - 271.5px)';

  if (location.pathname.includes('login')|| location.pathname.includes('cadastrar') || location.pathname.includes('editarVaga')) {
    minHeight = 'calc(100vh - 155px)'
  }

  return (
    <SearchProvider>
      {/* Fragment */}
      <Navbar />
      <MainContent minHeight={minHeight}>
        <Outlet />
      </MainContent>
      <Footer/>
    </SearchProvider>
  )
}

export default Layout