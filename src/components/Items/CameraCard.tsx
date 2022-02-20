import { useState, useRef, useEffect, RefObject } from 'react'

import { BiScreenshot } from 'react-icons/bi'
import { 
  ChevronDownIcon,
  CloseIcon,
  CheckIcon,
  DownloadIcon
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
  useDisclosure 
} from '@chakra-ui/react'
import ReactPlayer from 'react-player'
import { MeshRoom } from 'skyway-js'

import Config, {CameraStream} from '../../Config'


const CameraCard = (props: { video: CameraStream, room: MeshRoom | undefined }) => {
  const [videoRef, setVideoRef] = useState<any>()
  const [screenshot, setScreenshot] = useState<string>('')
  const [screenshotFilename, setScreenshotFilename] = useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  console.log(props.video?.config?.cameraDevices)
  const cameraName = props.video?.config?.cameraDevices[props.video?.config?.cameraIndex]?.text ?? '画面共有'

  const getAllCameraElements = () => {
    return props.video?.config?.cameraDevices.map((device, index) => {
      return <MenuItem key={device.id} onClick={() => changeCamera(index)}>{device.text}　{(index === props.video?.config?.cameraIndex) ? <CheckIcon/> : ''}</MenuItem>
    })
  }

  const changeCamera = (index: number) => {
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
      props.room?.send({
        cmd: 'removeCamera',
        peerId: props.video.peerId,
        data: {}
      })
    }
  }

  const getDateTime = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const MM = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    const hh = ('0' + d.getHours()).slice(-2);
    const mm = ('0' + d.getMinutes()).slice(-2);
    const ss = ('0' + d.getSeconds()).slice(-2);
    return yyyy + '-' + MM + '-' + dd + '_' + hh + '-' + mm + '-' + ss;
}

  const onScreenshot = () => {
    setScreenshotFilename(cameraName +'_'+ getDateTime() +'.png')
    onOpen()

    const videoElement = videoRef.getInternalPlayer()
    const canvasElement = document.createElement('canvas')

    const canvasSizeX = 1280; //HD画質
    const canvasSizeY = (canvasSizeX*videoElement.videoHeight)/videoElement.videoWidth;

    canvasElement.width = canvasSizeX
    canvasElement.height = canvasSizeY

    canvasElement.getContext('2d')?.drawImage(videoElement, 0, 0, canvasSizeX, canvasSizeY)
    setScreenshot(canvasElement.toDataURL('image/png'))
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

  return (
    <Center py={6}>
      <Box
        w={['87vw', '420px']}
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
        >
          <ReactPlayer ref={setVideoRef} url={props.video.stream} playing muted controls={true} width='420'/>
        </Box>
        <Stack>
          <Heading size="md" color="gray.700">
            {(props.video?.config?.cameraIndex ?? -1 < 0) ? cameraName : `カメラ - ${cameraName}`}
          </Heading>
          <Text color={'gray.500'}>
            {props.video.config?.userAgent}
          </Text>
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
                    <MenuItem onClick={onScreenshot}><BiScreenshot/>　スクリーンショット</MenuItem>
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