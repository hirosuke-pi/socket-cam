import { useState, useEffect } from 'react'

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
  useDisclosure,
  Box,
  Image,
  Text,
  Center
} from '@chakra-ui/react'

import { BiImages } from 'react-icons/bi'

import {EmotionImages} from '../../Config'

const DrawerImageButton = (props: {remoteImages: EmotionImages, title: string}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const showAllImages = () => {
    return props.remoteImages.map((image, index) => {
      return (
        <Box key={index} mb={4}>
          <Image src={image?.image} alt='image'/>
          <Center>{image?.date}</Center>
        </Box>
      )
    })
  }

  return (
    <>
      <MenuItem onClick={onOpen}><BiImages/>　検知した画像を見る</MenuItem>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{props.title}</DrawerHeader>
          <DrawerBody>
            {isOpen ? showAllImages() : ''}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DrawerImageButton