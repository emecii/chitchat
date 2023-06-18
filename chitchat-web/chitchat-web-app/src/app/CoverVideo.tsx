import React from 'react'
import styled from 'styled-components'
import GIF from '../assets/demoVideo.mp4'
import img from '../assets/coverImage1.png';
const VideoContainer = styled.div`
width: 100%;

video{
    width: 100%;
    height: auto;
}

@media (max-width: 64em) {
  min-width: 40vh;
}

img {
    width: 100%;
    height: auto;
    max-width: 600px;
    max-height: 600px;
    object-fit: cover;
  }

  @media (max-width: 64em) {
    min-width: 40vh;
  }
  
`
const CoverVideo = () => {
  return (
    <VideoContainer>
        {/* <video autoPlay muted loop>
          <source src={GIF} type="video/mp4" />
        </video> */}
         <img src={img} alt="Cover image" /> 
    </VideoContainer>
  )
}

export default CoverVideo