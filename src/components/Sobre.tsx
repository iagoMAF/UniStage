import styled from 'styled-components'

const SobreContent = styled.section`
  margin-top: 44px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 35px;
  background: #f5f5f5;

  & > div {
    max-width: 436px;
    max-height: 462px;

    & img {
      max-width: inherit;
      max-height: inherit;
      border-radius: 20px;
    }
  }

  .sobreContent {
    max-width: 705px;

    h2 {
      font-size: 35px;
      margin-bottom: 15px;
    }

    p {
      font-size: 20px;
      &::first-letter {
        font-size: 35px;
        font-weight: bold;
      }
    }
  }
`

const Sobre = () => {
  return (
    <SobreContent id='sobre'>
      <div>
        <img src="/src/assets/Images/sobre.jpg" alt="Imagem sobre a empresa" />
      </div>
      <div className='sobreContent'>
        <h2>Sobre a UniStage</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut sapien sit amet quam accumsan finibus. Aenean congue urna id ex consectetur, at hendrerit est ultricies. Morbi congue feugiat aliquet. Cras pharetra egestas orci et hendrerit. Quisque mattis quam ut magna accumsan pulvinar. Ut mauris tortor, dictum id ornare sit amet, eleifend ut nulla. Suspendisse nec nulla sed urna vehicula pharetra. Maecenas rutrum odio lacus, quis porttitor dui ultrices at.
        Nunc eu urna eget dui rutrum gravida. Praesent scelerisque arcu leo, eget interdum ipsum volutpat at. Phasellus eget urna sed nulla laoreet eleifend commodo eget mi. Suspendisse vitae tortor nibh. </p>
      </div>
    </SobreContent> 
  )
}

export default Sobre