import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect, RefObject } from 'react'
import ReactPlayer from 'react-player'

import { 
  ChevronDownIcon,
  SmallAddIcon,
  RepeatIcon,
  LinkIcon,
  CloseIcon,
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
  useClipboard
} from '@chakra-ui/react'

import Config, {getDateTime} from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import SoundChime from '../assets/audio/Chime.mp3'

import Peer, {MeshRoom} from 'skyway-js'

type Device = {
  text: string,
  id: string,
}

const Camera = ({isCamera = true}: {isCamera?: boolean}) => {
  const params = useParams()
  const peer = useRef(new Peer({ key: Config().SKYWAY_API_KEY }))
  const [roomId] = useState<string>(params.roomId || '')
  const [joinedDate, setJoinedDate] = useState<string>(getDateTime(false))
  const [localStream, setLocalStream] = useState<MediaStream>()
  const [cameraDevices, setCameraDevices] = useState<Device[]>([])
  const [cameraIndex, setCameraIndex] = useState<number>(0)
  const [isSmartPhone] = useState<boolean>(/iPhone|Android|iPad/.test(navigator.userAgent))
  const { hasCopied, onCopy } = useClipboard(window.location.href)
  const [SoundStatus, setSoundStatus] = useState('STOPPED');
  const toast = useToast()
  
  
  const onStartCamera = (stream: MediaStream, index: number, devices: Device[]) => {
    try {
      const room = peer.current.joinRoom(roomId, {
        mode: 'mesh',
        stream: stream
      })

      room.once('open', () => {
        toast({
          position: 'bottom',
          description: "ルームに接続しました。",
          status: "success",
          duration: 3000,
        })
        setJoinedDate(getDateTime(false))
      });

      room.on('data', async ({data, src}) => {
        if (!data?.cmd || (data?.peerId !== peer.current.id && !data?.broadcast)) return

        if (data.cmd === 'getConfig') {
          room.send({
            cmd: 'setConfig',
            status: 'success',
            peerId: src,
            data: {
              config: {
                userAgent: window.navigator.userAgent,
                name: devices?.[index]?.text ?? '画面共有',
                joinedDate: joinedDate
              },
              camera: {
                index: index,
                devices: devices
              }
            }
          })
        }
        else if (data.cmd === 'changeCamera') {
          window.location.replace(`/room/${roomId}/camera/${data.data.cameraIndex}`)
        }
        else if (data.cmd === 'removeCamera') {
          window.location.replace('/');
        }
        else if (data.cmd === 'soundBeep') {
          new Audio(SoundChime).play();
        }
      })

    } catch (error) {
      console.log(error)
      toast({
        position: 'bottom',
        description: "サーバーに接続できませんでした。5秒後に再接続します...",
        status: "error",
        duration: 3000,
      })

      setTimeout(() => {
        onStartCamera(stream, index, devices)
      }, 5000)
    }
  }

  const getCameraList = async () => {
    return (await navigator.mediaDevices.enumerateDevices())
    .filter((device) => device.kind === 'videoinput')
    .map((device) => {
      return {
        text: device.label,
        id: device.deviceId,
      } as Device;
    });
  }

  useEffect(() => {
    getCameraList().then(devices => {
      // カメラデバイスの設定
      const index = isNaN(Number(params?.cameraId)) ? 0 : Number(params?.cameraId)
      setCameraIndex(index)

      // スマホ判定
      if (isSmartPhone) {
        devices = [
          {text: 'バックカメラ', id: 'environment'},
          {text: 'フロントカメラ', id: 'user'}
        ]
      }
      console.log(devices)
      setCameraDevices(devices)

      if (isCamera && (devices.length <= 0 || devices.length <= index)) {
        toast({
          position: 'bottom',
          description: "カメラが見つかりませんでした。",
          status: "error",
          duration: 3000,
        })
        return
      }

      // 画面共有かカメラか
      if (isCamera) {
        navigator.mediaDevices.getUserMedia({ video: isSmartPhone ? { facingMode: devices[index].id } : {deviceId: devices[index].id}, audio: true }).then(localStreamTmp => {
          setLocalStream(() => localStreamTmp)
          onStartCamera(localStreamTmp, index, devices)
        })
      }
      else {
        navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }).then( localStreamTmp => {
          setLocalStream(() => localStreamTmp)
          onStartCamera(localStreamTmp, -1, devices)
        }).catch(error => {
          toast({
            position: 'bottom',
            description: "画面が選択されていません。リロードして、選択しなおしてください",
            status: "error",
            duration: 5000,
          })
        })
      }
    })
  }, [])
  
  const getAllCameraElements = () => {
    return cameraDevices.map((device, index) => {
      return <MenuItem key={device.id} onClick={() => window.location.href = `/room/${roomId}/camera/${index}`}>{device.text}　{(index === cameraIndex && isCamera) ? <CheckIcon/> : ''}</MenuItem>
    })
  }

  const onCopyUrl = () => {
    onCopy()
    toast({
      position: 'bottom',
      description: 'クリップボードにコピーしました！',
      status: 'success',
      duration: 3000,
    })
  }

  const onDropout = () => {
    if (window.confirm('本当に監視カメラを終了しますか？')) {
      window.location.href = '/'
    }
  }

  return (
    <>
      <Header/>
        <Wrap justify={["center", "space-between"]} mr={5} ml={5}>
          <WrapItem>
            <Heading ml={5} mr={5} mt={5} size="md" color="gray.700"><Center>{isCamera ? `カメラ - ${cameraDevices[cameraIndex]?.text ?? 'なし'}` : '画面共有'}</Center></Heading>
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
                <MenuItem isDisabled={isSmartPhone} onClick={() => window.location.href = `/room/${roomId}/display`}>画面を共有　{isCamera ? '' : <CheckIcon/>}</MenuItem>
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
                <MenuItem onClick={onCopyUrl}><LinkIcon/>　リンクを共有</MenuItem>
                <MenuItem onClick={() => window.location.reload()}><RepeatIcon/>　サーバーに再接続</MenuItem>
                <Divider mt={2} mb={2}/>
                <MenuItem onClick={onDropout}><CloseIcon/>　カメラを切断</MenuItem>
              </MenuList>
            </Menu>
          </WrapItem >
        </Wrap>
        <Box h="3px" m={2} bg="blue.400"/>
        <Center>
          <ReactPlayer playsinline={true} url={localStream} playing muted controls={true} width='95vw' height='75vh'/>
        </Center>
      <Footer/>
    </>
  );
}

export default Camera;
  