import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { DropdownButton, Dropdown } from 'react-bootstrap';

import Config from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'

import Peer, {MeshRoom} from 'skyway-js'

const Dashboard = () => {
  const peer = new Peer({ key: Config().SKYWAY_API_KEY });
  const params = useParams()
  const theirRef = useRef<HTMLVideoElement>(null)
  const [roomId] = useState<string>(params.dashboardId || '')
  const hostUrl = window.location.origin
  const [headerMargin, setheaderMargin] = useState(false);

  const onStartStream = () => {
    try {
      const room = peer.joinRoom(roomId, {
        mode: 'mesh'
      })

      room.once('open', () => {
        console.log('Joined')
      });

      room.on('peerJoin', peerId => {
        console.log(peerId)
      });

      room.on('stream', (stream: MediaStream) => {
        const videoElm = theirRef.current;
        if (videoElm) {
          videoElm.srcObject = stream;
          videoElm.play();
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
//<QRCode value={`${hostUrl}/camera/${roomId}`} />
  return (
    <>
      <Header/>
        <main>
          <article className="flex flex-row p-1 mr-5 ml-5  border-sky-300 border-b-4 justify-between items-center flex-wrap">
            <section className="text-2xl">
              Home &gt; ダッシュボード
            </section>
            <section className="">
              <button type="button" className="text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:ring-sky-200 font-medium rounded-md text-sm px-5 py-2.5 text-center mr-2 mb-1">カメラを追加</button>
              <button type="button" className="text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:ring-sky-200 font-medium rounded-md text-sm px-5 py-2.5 text-center mr-2 mb-1 inline-flex items-center">アクション <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button>
              <DropdownButton id="dropdown-basic-button" title="Dropdown button">
  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
</DropdownButton>
            </section>
          </article>
          <article>
          <CameraCard/>
            <video ref={theirRef} width="400px" autoPlay muted playsInline></video>
            <button onClick={onStartStream}>start</button>
          </article>
        </main>
      <Footer/>
    </>
  );
}

export default Dashboard;
  