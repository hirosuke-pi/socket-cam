import { useParams } from "react-router-dom"

import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'

const Camera = () => {
  const params = useParams()
  return (
    <>
      <Header/>
        <main>
          {params.cameraId} - camera
        </main>
      <Footer/>
    </>
  );
}

export default Camera;
  