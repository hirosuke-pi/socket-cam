import { useState, useRef, useEffect, RefObject } from 'react'

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  AspectRatio,
  useColorModeValue,
  Image
} from '@chakra-ui/react'
import ReactPlayer from 'react-player'

type CameraStream = {
  stream: MediaStream;
  peerId: string;
};

const CameraCard = (props: { video: CameraStream}) => {
  console.log(props.video)
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
          <ReactPlayer url={props.video.stream} playing muted controls={true} width='420'/>
        </Box>
        <Stack>
          <Text color={'gray.500'}>
            ペアID: {props.video.peerId}
          </Text>
        </Stack>
      </Box>
    </Center>
  );
}

export default CameraCard