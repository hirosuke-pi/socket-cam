import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect, RefObject } from 'react'
import ReactPlayer from 'react-player'

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
  AspectRatio,
  useToast,
  useDisclosure
} from '@chakra-ui/react'

import Config from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'

import Peer, {MeshRoom} from 'skyway-js'

const Camera = () => {
  const params = useParams()
  const peer = useRef(new Peer({ key: Config().SKYWAY_API_KEY }))
  const [roomId] = useState<string>(params.roomId || '')
  const [localStream, setLocalStream] = useState<MediaStream>()
  const toast = useToast()

  const onStartCamera = (stream: MediaStream) => {
    try {
      const room = peer.current.joinRoom(roomId, {
        mode: 'mesh',
        stream: stream
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

  const getCameraList = async () => {
    return (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind === 'videoinput')
    .map((device) => {
      return {
        text: device.label,
        value: device.deviceId,
      };
    });
  }

  useEffect(() => {
    getCameraList().then(devices => {
      console.log(devices)
      const cameraIndex = isNaN(Number(params?.cameraId)) ? 0 : Number(params?.cameraId)
      navigator.mediaDevices.getUserMedia({ video: {deviceId: devices[cameraIndex].value}, audio: true }).then(localStreamTmp => {
        setLocalStream(() => localStreamTmp)
        onStartCamera(localStreamTmp)
      })
    })
  }, [])

  return (
    <>
      <Header/>
        <Wrap justify={["center", "space-between"]} mr={5} ml={5}>
          <WrapItem>
            <Heading ml={5} mr={5} mt={5} size="md" color="gray.700"><Center>カメラ</Center></Heading>
          </WrapItem >
          <WrapItem >
            <Menu>
              <MenuButton
                mt={2}
                mb={2}
                ml={2}
                mr={5}
                as={Button}
                variant="solid"
                colorScheme="teal"
                rightIcon={<ChevronDownIcon />}
              >
                カメラ 
              </MenuButton>
              <MenuList>
                <MenuItem><LinkIcon/>　リンクを共有</MenuItem>
                <MenuItem><RepeatIcon/>　サーバーに再接続</MenuItem>
                <Divider mt={2} mb={2}/>
                <MenuItem><DeleteIcon/>　ダッシュボードを削除</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton
                mt={2}
                mb={2}
                ml={2}
                mr={5}
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
        <Center>
          <ReactPlayer url={localStream} playing muted controls={true} width='95vw' height='75vh'/>
        </Center>
      <Footer/>
    </>
  );
}

export default Camera;
  