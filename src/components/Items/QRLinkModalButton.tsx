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
  Icon
} from '@chakra-ui/react'

import { RiVideoAddFill } from 'react-icons/ri'
import { 
  SmallAddIcon,
  CopyIcon,
  CheckIcon

} from '@chakra-ui/icons'

import QRCode from "react-qr-code"
import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Config from '../../Config'

const QRLinkModalButton = () => {
  const [cameraUrl] = useState(`${window.location.origin}/room/${localStorage.getItem(Config().DASHBOARD_ID) ?? ''}/camera`)
  const { hasCopied, onCopy } = useClipboard(cameraUrl)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button 
        m={2} 
        colorScheme="teal"
        mt={2}
        mb={2}
        rightIcon={<RiVideoAddFill/>}
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
                {hasCopied ? <CheckIcon/> : <CopyIcon/>}
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
