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

import { 
  SmallAddIcon,
  CopyIcon,
  CheckIcon

} from '@chakra-ui/icons'

import QRCode from "react-qr-code"
import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import Config from '../../Config'

const QRLinkModalButton = (props: {buttonElement: Function, title: string, url: string}) => {
  const { hasCopied, onCopy } = useClipboard(props.url)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const generateButtonElement = (onOpenEvent: React.MouseEventHandler<HTMLButtonElement>) => {
    return props.buttonElement(onOpenEvent)
  }

  return (
    <>
      {generateButtonElement(onOpen)}
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset='slideInBottom'
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Center>{props.title}</Center></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <QRCode value={props.url} />
            </Center>
            <Flex mt={5}>
              <Input value={props.url} isReadOnly width="100%"/>
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
