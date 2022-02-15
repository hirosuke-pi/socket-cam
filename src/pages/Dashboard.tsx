import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'


import { 
  ChevronDownIcon,
  SmallAddIcon,
  RepeatIcon,
  LinkIcon,
  DeleteIcon
} from '@chakra-ui/icons'

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button, 
  Box,
  Heading,
  Wrap, 
  WrapItem,
  Spacer,
  Divider,
  Center,
  useToast,
  useDisclosure
} from '@chakra-ui/react'

import Config from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'
import QRLinkModalButton from '../components/Items/QRLinkModalButton'

import Peer, {MeshRoom} from 'skyway-js'

const Dashboard = () => {
  const peer = new Peer({ key: Config().SKYWAY_API_KEY });
  const params = useParams()
  const theirRef = useRef<HTMLVideoElement>(null)
  const [roomId] = useState<string>(params.dashboardId || '')
  const hostUrl = window.location.origin
  const toast = useToast()

  const onStartStream = () => {
    try {
      const room = peer.joinRoom(roomId, {
        mode: 'mesh'
      })

      room.once('open', () => {
        toast.closeAll()
        toast({
          position: 'bottom',
          description: "接続しました。",
          status: "success",
          duration: 3000,
        })
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
      toast.closeAll()
      toast({
        position: 'bottom',
        description: "サーバーに接続できませんでした。再度更新して接続してください。",
        status: "error",
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    setTimeout(onStartStream, 1000)

    toast({
      position: 'bottom',
      description: "サーバーに接続しています...",
      duration: null,
    })
  }, [])

  return (
    <>
      <Header/>
        <Wrap justify={["center", "space-between"]}>
          <WrapItem>
            <Heading mt={5} ml={5} mr={5} size="md" color="gray.700"><Center>ダッシュボード</Center></Heading>
          </WrapItem >
          <WrapItem >
            <QRLinkModalButton/>
            <Menu>
              <MenuButton
                mr={5}
                mt={2}
                mb={2}
                ml={2}
                as={Button}
                variant="solid"
                colorScheme="blue"
                rightIcon={<ChevronDownIcon />}
              >
                アクション 
              </MenuButton>
              <MenuList>
                <MenuItem><LinkIcon/>　リンクを共有</MenuItem>
                <MenuItem><RepeatIcon/>　サーバーに再接続</MenuItem>
                <Divider mt={2} mb={2}/>
                <MenuItem><DeleteIcon/>　ダッシュボードを削除</MenuItem>
              </MenuList>
            </Menu>
          </WrapItem >
        </Wrap>
        <Box h="3px" m={2} bg="blue.400"/>
        <Wrap m={5}>
          <CameraCard/>
          <CameraCard/>
          <video ref={theirRef} width="400px" autoPlay muted playsInline></video>
        </Wrap>
      <Footer/>
    </>
  );
}

export default Dashboard;
  