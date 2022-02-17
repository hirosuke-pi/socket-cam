import { useParams } from 'react-router-dom'
import { useState, useRef, useEffect, RefObject } from 'react'

import { 
  ChevronDownIcon,
  CloseIcon,
  RepeatIcon,
  LinkIcon,
  ArrowBackIcon
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
  useToast,
  useClipboard
} from '@chakra-ui/react'
import { useNavigate, NavigateFunction } from "react-router-dom";

import Config from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'
import QRLinkModalButton from '../components/Items/QRLinkModalButton'

import Peer, {MeshRoom} from 'skyway-js'

type CameraStream = {
  stream: MediaStream;
  peerId: string;
};

const Dashboard = () => {
  const peer = useRef(new Peer({ key: Config().SKYWAY_API_KEY }));
  const params = useParams()
  const [roomId] = useState<string>(params.roomId || '')
  const [remoteVideo, setRemoteVideo] = useState<CameraStream[]>([]);
  const { hasCopied, onCopy } = useClipboard(window.location.href)
  const navigate = useNavigate();
  const toast = useToast()

  const onStartStream = () => {
    try {
      const room = peer.current.joinRoom(roomId, {
        mode: 'mesh'
      })

      room.once('open', () => {
        toast.closeAll()
        toast({
          position: 'bottom',
          description: "接続しました。",
          status: "success",
          duration: 3000,
        })
      });

      room.on('peerJoin', peerId => {
        console.log(peerId)
        toast.closeAll()
        toast({
          position: 'bottom',
          title: 'カメラが追加されました。',
          description: `ペアID: ${peerId}`,
          status: 'success',
          duration: 3000,
        })
      });

      room.on('peerLeave', (peerId) => {
        setRemoteVideo((prev) => {
          return prev.filter((video) => {
            if (video.peerId === peerId) {
              video.stream.getTracks().forEach((track) => track.stop());
            }
            return video.peerId !== peerId
          })
        })

        toast({
          position: 'bottom',
          title: 'カメラが切断されました。',
          status: "error",
          description: `ペアID: ${peerId}`,
          duration: 3000,
        })
      })

      room.on('stream', async (stream) => {
        setRemoteVideo((prev) => [
          ...prev,
          { stream: stream, peerId: stream.peerId },
        ]);
      })
    } catch (error) {
      console.log(error)
      toast.closeAll()
      toast({
        position: 'bottom',
        description: "サーバーに接続できませんでした。再度更新して接続してください。",
        status: "error",
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    setTimeout(onStartStream, 1000)

    toast({
      position: 'bottom',
      description: "サーバーに接続しています...",
      duration: null,
    })
  }, [])

  const showCamera = () => {
    return remoteVideo.map((video) => {
      return <CameraCard video={video} key={video.peerId} />;
    });
  };

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
    if (window.confirm('本当に退出しますか？')) {
      navigate('/')
      window.location.reload()
    }
  }

  return (
    <>
      <Header/>
        <Wrap justify={["center", "space-between"]} mr={5} ml={5}>
          <WrapItem>
            <Heading ml={5} mr={5} mt={5} size="md" color="gray.700"><Center>ダッシュボード</Center></Heading>
          </WrapItem >
          <WrapItem >
            <QRLinkModalButton/>
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
                <MenuItem onClick={onCopyUrl}><LinkIcon/>　リンクをコピー</MenuItem>
                <MenuItem onClick={() => window.location.reload()}><RepeatIcon/>　サーバーに再接続</MenuItem>
                <Divider mt={2} mb={2}/>
                <MenuItem onClick={onDropout}><ArrowBackIcon/>　ホームに戻る</MenuItem>
              </MenuList>
            </Menu>
          </WrapItem >
        </Wrap>
        <Box h="3px" m={2} bg="blue.400"/>
        <Wrap m={5}>
          {showCamera()}
        </Wrap>
      <Footer/>
    </>
  );
}

export default Dashboard;
  