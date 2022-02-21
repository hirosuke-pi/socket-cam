import { useState, useRef } from 'react'

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  MenuItem,
  Button,
  useDisclosure
} from '@chakra-ui/react'

import { BiImages } from 'react-icons/bi'


const DrawerImageButton = (props: {isDisabled: boolean, remoteVideo: string[]}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <MenuItem onClick={onOpen} isDisabled={!props.isDisabled}><BiImages/>　検知した画像を見る</MenuItem>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>検知した画像一覧</DrawerHeader>
          <DrawerBody>
            aaaaaaaa
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerImageButton