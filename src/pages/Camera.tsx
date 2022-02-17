import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect, RefObject } from 'react'
import ReactPlayer from 'react-player'

import { 
  ChevronDownIcon,
  SmallAddIcon,
  RepeatIcon,
  LinkIcon,
  DeleteIcon,
  CheckIcon
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
import { useNavigate, NavigateFunction } from "react-router-dom";

import Config from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'

import Peer, {MeshRoom} from 'skyway-js'

type Device = {
  text: string,
  id: string,
}

const Camera = () => {
  const params = useParams()
  const peer = useRef(new Peer({ key: Config().SKYWAY_API_KEY }))
  const [roomId] = useState<string>(params.roomId || '')
  const [localStream, setLocalStream] = useState<MediaStream>()
  const [cameraDevices, setCameraDevices] = useState<Device[]>([])
  const [cameraIndex, setCameraIndex] = useState<number>(0)
  const toast = useToast()
  const navigate = useNavigate();
  
  const onStartCamera = (stream: MediaStream) => {
    try {
      const room = peer.current.joinRoom(roomId, {
        mode: 'mesh',
        stream: stream
      })

      room.once('open', () => {
        toast({
          position: 'bottom',
          description: "接続しました。",
          status: "success",
          duration: 3000,
        })
      });

    } catch (error) {
      console.log(error)
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
        id: device.deviceId,
      };
    });
  }

  useEffect(() => {
    getCameraList().then(devices => {
      console.log(devices)
      if (devices.length <= 0) {
        toast({
          position: 'bottom',
          description: "カメラが見つかりませんでした。",
          status: "error",
          duration: 3000,
        })
        return
      }

      const index = isNaN(Number(params?.cameraId)) ? 0 : Number(params?.cameraId)
      setCameraDevices(devices)
      setCameraIndex(index)

      if (index < 0) {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then( localStreamTmp => {
          setLocalStream(() => localStreamTmp)
          onStartCamera(localStreamTmp)
        })
        return
      } 
      navigator.mediaDevices.getUserMedia({ video: {deviceId: devices[index].id}, audio: true }).then(localStreamTmp => {
        setLocalStream(() => localStreamTmp)
        onStartCamera(localStreamTmp)
      })
    })
  }, [])


  const onNavigate = (index: number) => {
    setCameraIndex(index)
    navigate(`/camera/${roomId}/${index}`)
    window.location.reload();
  }
  
  const getAllCameraElements = () => {
    return cameraDevices.map((device, index) => {
      return <MenuItem key={device.id} onClick={() => onNavigate(index)}>{device.text}　{index === cameraIndex ? <CheckIcon/> : ''}</MenuItem>
    })
  }

  return (
    <>
      <Header/>
        <Wrap justify={["center", "space-between"]} mr={5} ml={5}>
          <WrapItem>
            <Heading ml={5} mr={5} mt={5} size="md" color="gray.700"><Center>カメラ - {0 <= cameraIndex ? cameraDevices[cameraIndex]?.text : 'デスクトップ共有'}</Center></Heading>
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
                {getAllCameraElements()}
                <Divider mt={2} mb={2}/>
                <MenuItem onClick={() => onNavigate(-1)}>デスクトップを共有</MenuItem>
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
  