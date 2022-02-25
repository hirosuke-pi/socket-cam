import { useState, useRef, useEffect, RefObject } from 'react'

import { BiScreenshot, BiZoomIn, BiZoomOut, BiImages } from 'react-icons/bi'

import { MdVideoCameraBack, MdPeopleAlt, MdSettings, MdSend } from 'react-icons/md'
import { 
  ChevronDownIcon,
  CloseIcon,
  CheckIcon,
  DownloadIcon,
  BellIcon,
  RepeatIcon
} from '@chakra-ui/icons'

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  AspectRatio,
  useColorModeValue,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Divider,
  Wrap,
  Editable,
  EditablePreview,
  EditableInput,
  WrapItem,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  IconButton,
  Flex
} from '@chakra-ui/react'

import ReactPlayer from 'react-player'
import { MeshRoom } from 'skyway-js'

import Config, {CameraStream, getDateTime, EmotionImages} from '../../Config'
import DrawerImageButton from './DrawerImageButton'

const platform = require('platform')


const CameraCard = (props: { video: CameraStream, room: MeshRoom | undefined, toastShow: Function, dashboardName: string }) => {
  const [videoRef, setVideoRef] = useState<any>()
  const [screenshot, setScreenshot] = useState<string>('')
  const [screenshotFilename, setScreenshotFilename] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isCameraZoom, setCameraZoom] = useState<boolean>(false)

  const [isMotionEnable, setIsMotionEnable] = useState<boolean>(false)
  const [isMotionNotification, setMotionNotification] = useState<boolean>(false)
  const [isMotionNotificationSend, setMotionNotificationSend] = useState<boolean>(false)
  const [isMotionNotificationBuff, setMotionNotificationBuff] = useState<boolean>(false)
  const [motionInterval, setMotionInterval] = useState<any>(null)
  const [isMotionMove, setMotionMove] = useState<boolean>(false)
  const [motionImages, setMotionImages] = useState<EmotionImages>([])

  const [motionMatrix, setMotionMatrix] = useState<number[]>([])
  const [motionMatrixBefore, setMotionMatrixBefore] = useState<number[]>([])

  const [notificationDescription, setNotificationDescription] = useState<string>('')
  const [notificationDescriptionEnable, setNotificationDescriptionEnable] = useState<boolean>(false)

  const getAllCameraElements = () => {
    return props.video?.camera?.devices.map((device, index) => {
      return <MenuItem key={device.id} onClick={() => changeCamera(index)}>{device.text}　{(index === props.video?.camera?.index) ? <CheckIcon/> : ''}</MenuItem>
    })
  }

  const changeCamera = (index: number) => {
    exitMotionInterval()
    props.room?.send({
      cmd: 'changeCamera',
      peerId: props.video.peerId,
      data: {
        cameraIndex: index
      }
    })
  }

  const onRemoveCamera = () => {
    if (window.confirm('本当に監視カメラを終了しますか？')) {
      exitMotionInterval()
      props.room?.send({
        cmd: 'removeCamera',
        peerId: props.video.peerId,
        data: {}
      })
    }
  }

  const onScreenshotCanvas = (sizeX: number = 1920) => {
    const videoElement = videoRef.getInternalPlayer()
    if (videoElement == null) return null

    const canvasElement = document.createElement('canvas')

    const canvasSizeX = sizeX; //FullHD画質
    const canvasSizeY = (canvasSizeX*videoElement.videoHeight)/videoElement.videoWidth;

    canvasElement.width = canvasSizeX
    canvasElement.height = canvasSizeY

    canvasElement.getContext('2d')?.drawImage(videoElement, 0, 0, canvasSizeX, canvasSizeY)

    return canvasElement
  }

  const getCanvasMatrix = (canvas: HTMLCanvasElement | null) => {
    if (canvas === null) return []

    const ctx = canvas.getContext("2d")
    const sourceCanvas = ctx?.getImageData(0, 0, canvas?.width, canvas?.height) ?? null

    if (sourceCanvas == null) return []

    const matrix = []
    for (let p = 0; p < sourceCanvas.data.length; p += 4) {
      const y = 0.2126 * sourceCanvas.data[p] + 0.7152 * sourceCanvas.data[p + 1] + 0.0722 * sourceCanvas.data[p + 2]
      matrix.push(Math.round(y))
    }

    return matrix
  }


  const onScreenshot = () => {
    setScreenshotFilename(props.video?.config?.name +'_'+ getDateTime() +'.jpg')
    onOpen()

    setScreenshot(onScreenshotCanvas()?.toDataURL('image/jpg') ?? '')
  }

  const onDownloadScreenshot = () => {
    const download = document.createElement("a")
    download.download = screenshotFilename
    download.href = screenshot
    download.click()

    // データ解放
    onClose()
    setScreenshot('')
    setScreenshotFilename('')
  }

  const getUserInfo = () => {
    return platform.parse(props.video.config?.userAgent)?.description ?? props.video.config?.userAgent
  }

  const createCameraZoomElement = () => {
    return isCameraZoom ? (
      <MenuItem onClick={() => setCameraZoom(false)}><BiZoomOut/>　縮小</MenuItem>
    ) : (
      <MenuItem onClick={() => setCameraZoom(true)}><BiZoomIn/>　拡大</MenuItem>
    )
  }

  const onChangedMotion = (isChecked: boolean ) => {
    setIsMotionEnable(isChecked)
  }

  useEffect(() => {
    let intervalFunc: any = null
    if (isMotionEnable && motionInterval === null) {
      intervalFunc = setInterval(() =>{
        const matrixSizeX = 30 // 縮小時の横幅
        const matrix = getCanvasMatrix(onScreenshotCanvas(matrixSizeX))
        if (matrix.length <= 0) {
          exitMotionInterval()
        }


        setMotionMatrix(matrix)
      }, 2000)
      setMotionInterval(intervalFunc)
    }
    else {
      exitMotionInterval()
    }
    return () => {clearInterval(intervalFunc)};
  }, [isMotionEnable])


  // モーション検知
  useEffect(() => {
    if (motionMatrix.length <= 0) return;
    
    const errorValue = 5 // 前回の値との許容誤差
    const threshold = 50 // 動体検知のしきい値

    const diff = motionMatrixBefore.filter((nowValue, index) => {
      return motionMatrix[index] + errorValue < nowValue || motionMatrix[index] > nowValue + errorValue
    }).length

    setMotionMatrixBefore(motionMatrix)
    
    if (diff > threshold) {
      const insertImage = {image: onScreenshotCanvas(640)?.toDataURL('image/jpg') ?? '', date: getDateTime(false)}
      setMotionImages(prev => [insertImage, ...(prev.length >= 10 ? prev.slice(0, -1) : prev)])
      setMotionMove(true)

      if (isMotionNotificationBuff) {
        showMotionNotification(`${props.video?.config?.name ?? ''} - 動体検知しました！`)
        onMotionNotificationSend()
        setMotionNotificationBuff(false)
      }
    }
    else {
      setMotionMove(false)
      setMotionNotificationBuff(true)
    }
  }, [motionMatrix])


  const exitMotionInterval = () => {
    setMotionMatrix([])
    setMotionInterval(null)
    clearInterval(motionInterval)
  }

  const onChangedNotification = (isChecked: boolean) => {
    if (isChecked && Notification) {
      const permission = Notification.permission;
      if (permission === "denied") {
        props.toastShow('通知が許可されていません。ブラウザの設定から通知を許可して下さい。', null, true)
        return
      } 
      else if (permission === "granted") {
        setMotionNotification(true)
        return
      }

      Notification.requestPermission().then(() => {
        new Notification('通知が許可されました。')
        setMotionNotification(true)
      }).catch(() => {
        props.toastShow('通知が許可されませんでした。ブラウザの設定から通知を許可して下さい。', null, true)
      })
    }
    else {
      setMotionNotification(false)
    }
  }

  const showMotionNotification = (message: string) => {
    if (isMotionNotification) {
      new Notification(message)
    }
  }

  const onSendNotification = () => {
    props.room?.send({
      cmd: 'soundNotification',
      peerId: props.video.peerId,
      data: {
        text: notificationDescription,
        from: props.dashboardName
      }
    })
    setNotificationDescriptionEnable(true)
    props.toastShow('通知を送信しました。5秒後に再通知可能になります。', null)
  }

  useEffect(() => {
    if (notificationDescriptionEnable) {
      setTimeout(() => {
        setNotificationDescriptionEnable(false)
      }, 5000)
    }
  }, [notificationDescriptionEnable])

  const onMotionNotificationSend = () => {
    if (isMotionNotificationSend) {
      onSendNotification()
    }
  }

  const onReloadCamera = () => {
    props.room?.send({
      cmd: 'reloadCamera',
      peerId: props.video.peerId,
      data: {}
    })
  }

  return (
    <Center py={6}>
      <Box
        w={['90vw', (isCameraZoom ? '95vw' : '420px'), (isCameraZoom ? '95vw' : '420px'), (isCameraZoom ? '95vw' : '420px'), (isCameraZoom ? '95vw' : '420px'), (isCameraZoom ? '1420px' : '420px')]}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'md'}
        rounded={'md'}
        p={6}
        >
        <Box
          bg={'gray.100'}
          mt={-6}
          mx={-6}
          mb={6}
          borderWidth={isMotionEnable && isMotionMove ? '5px' : '0px'}
          borderColor={'orange.400'}
        >
          <ReactPlayer playsinline={true} ref={setVideoRef} url={props.video.stream} playing muted controls={true} width='100%' height='100%'/>
        </Box>
        <Stack>
          <Heading size="md" color="gray.700">
            <Icon as={MdVideoCameraBack}/> {(props.video?.camera?.index ?? -1 < 0) ? props.video?.config?.name : `カメラ - ${props.video?.config?.name}`}
          </Heading>
          <Text color={'gray.500'}>
            {getUserInfo()}
          </Text>
          <Accordion allowMultiple pt={2}>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    <Icon as={MdSettings} mb={1}/> モーション検知・通知
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <FormControl display='flex' alignItems='center'>
                  <FormLabel htmlFor={`motion-${props.video?.peerId}`} mb='0'>
                    <Icon as={MdPeopleAlt}/> モーション検知
                  </FormLabel>
                  <Switch id={`motion-${props.video?.peerId}`} onChange={(event) => onChangedMotion(event.target.checked)}/>
                </FormControl>
                <FormControl display='flex' alignItems='center' mt={1}>
                  <FormLabel  htmlFor={`notification-${props.video?.peerId}`} mb='0'>
                    <BellIcon mb={1}/> 検知した場合、通知する
                  </FormLabel>
                  <Switch id={`notification-${props.video?.peerId}`} isDisabled={!isMotionEnable} onChange={(event) => onChangedNotification(event.target.checked)}/>
                </FormControl>
                <FormControl display='flex' alignItems='center' mt={1}>
                  <FormLabel  htmlFor={`send-${props.video?.peerId}`} mb='0'>
                    <Icon as={MdSend} mb={1}/> 検知した場合、通知内容を送信する
                  </FormLabel>
                  <Switch id={`send-${props.video?.peerId}`} isDisabled={!isMotionEnable} onChange={(event) => setMotionNotificationSend(event.target.checked)}/>
                </FormControl>
                <Flex mt={4}>
                  <Input placeholder='通知内容を入力' mr={2} defaultValue={''} onChange={(event) => setNotificationDescription(event.target.value)}/>
                  <IconButton colorScheme='blue' isLoading={notificationDescriptionEnable} aria-label='Search database' icon={<MdSend />} onClick={onSendNotification}/>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Box mt={5}>
            <Wrap justify={["center", "right"]} mt={5}>
              <WrapItem w={['100%', '140px']}>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="solid"
                    colorScheme="teal"
                    w={['100%', '140px']}
                    rightIcon={<ChevronDownIcon />}
                  >
                    カメラ 
                  </MenuButton>
                  <MenuList>
                    {getAllCameraElements()}
                  </MenuList>
                </Menu>
              </WrapItem>
              <WrapItem w={['100%', '140px']}>
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="solid"
                    colorScheme="blue"
                    w={['100%', '140px']}
                    rightIcon={<ChevronDownIcon />}
                  >
                    アクション 
                  </MenuButton>
                  <MenuList>
                    <DrawerImageButton remoteImages={motionImages} title={props.video?.config?.name ?? 'なし'}/>
                    <MenuItem onClick={onScreenshot}><BiScreenshot/>　スクリーンショット</MenuItem>
                    {createCameraZoomElement()}
                    <Divider mt={2} mb={2}/>
                    <MenuItem onClick={onReloadCamera}><RepeatIcon/>　カメラを再読み込み</MenuItem>
                    <Divider mt={2} mb={2}/>
                    <MenuItem onClick={onRemoveCamera}><CloseIcon/>　カメラを削除</MenuItem>
                  </MenuList>
                </Menu>
              </WrapItem>
            </Wrap>
          </Box>
        </Stack>
      </Box>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
        size='xl'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Center>{screenshotFilename}</Center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Image alt='screenshot' src={screenshot} />
            </Center>
            <Center mt={5}>
              <Button w='100%' rightIcon={<DownloadIcon />} onClick={onDownloadScreenshot}>ダウンロード</Button>
            </Center>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}

export default CameraCard