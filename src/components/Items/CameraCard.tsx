import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  AspectRatio,
  useColorModeValue,
  Image
} from '@chakra-ui/react';

export default function CameraCard() {
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
          <AspectRatio maxW='420px'>
            <iframe
              title='naruto'
              src='https://www.youtube.com/embed/QhBnZ6NPOY0'
              allowFullScreen
            />
          </AspectRatio>
        </Box>
        <Stack>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}>
            カメラタイトル
          </Heading>
          <Text color={'gray.500'}>
            ssss
          </Text>
        </Stack>
      </Box>
    </Center>
  );
}