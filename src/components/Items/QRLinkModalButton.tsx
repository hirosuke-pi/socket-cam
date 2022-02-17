import {
  Modal,
  Button, 
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Center,
  Flex,
  Input,
  useClipboard,
  VStack
} from '@chakra-ui/react'

import { 
  SmallAddIcon,
} from '@chakra-ui/icons'

import QRCode from "react-qr-code"
import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

const QRLinkModalButton = () => {
  const params = useParams()
  const [roomId] = useState<string>(params.roomId || '')
  const [cameraUrl] = useState(`${window.location.origin}/camera/${roomId}`)
  const { hasCopied, onCopy } = useClipboard(cameraUrl)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button 
        m={2} 
        colorScheme="teal"
        mr={2}
        mt={2}
        mb={2}
        ml={5}
        rightIcon={<SmallAddIcon />}
        onClick={onOpen}
      >
        カメラ追加
      </Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Center>監視カメラを追加</Center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <QRCode value={cameraUrl} />
            </Center>
            <Flex mt={5}>
              <Input value={cameraUrl} isReadOnly width="100%"/>
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? 'コピー済み' : 'コピー'}
              </Button>
            </Flex>
            <Center mt={5}>
              カメラアプリでQRコードを読み取るか、<br/>リンクにアクセスしてください。
            </Center>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default QRLinkModalButton;
