import styled, { css } from 'styled-components';

const commonStyles = css`
  max-width: 100dvw;
  display: flex;
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 30px;
  }
`;

const FooterPadrao = styled.footer`
  ${commonStyles}
  flex-direction: column;
  background: #4F4F51;
  padding: 31px;
  text-align: center;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  p, h3 {
    color: #fff;
  }
`;

const FooterCadastro = styled.footer`
  ${commonStyles}
  gap: 25px;
  color: #000;

  div {
    display: flex;
    gap: 25px;
    font-weight: bold;
  }

  p, h3 {
    color: #000;
  }
`;

const Footer = () => {
  const param = location.pathname.replace('/', '');  

  const isAlternate = param.includes('login') || param.includes('cadastrar') || param.includes('editarVaga');
  const FooterComponent = isAlternate ? FooterCadastro : FooterPadrao;

  return (
    <FooterComponent>
      <h3>Contato</h3>
      <div>
        <p>@Instagram: @uniStageVagas</p>
        <p>E-mail: uniStage@gmail.com</p>
        <p>Telefone: 38 9 9999-9999</p>
      </div>
    </FooterComponent>
  );
};

export default Footer;
