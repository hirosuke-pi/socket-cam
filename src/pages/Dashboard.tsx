import { useState, useRef, useEffect, RefObject } from 'react'

import { RiVideoAddLine } from 'react-icons/ri'
import { 
  ChevronDownIcon,
  CloseIcon,
  RepeatIcon,
  DeleteIcon,
  ArrowBackIcon,
  LinkIcon
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
  useClipboard,
  Editable,
  EditablePreview,
  EditableInput,
  Spinner,
  Flex,
  Icon
} from '@chakra-ui/react'
import { useNavigate, NavigateFunction } from "react-router-dom";

import Config, {CameraStream} from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'
import QRLinkModalButton from '../components/Items/QRLinkModalButton'

import Peer, {MeshRoom} from 'skyway-js'


const Dashboard = () => {
  const peer = useRef(new Peer({ key: Config().SKYWAY_API_KEY }));
  const [dashboardName, setDashboardName] = useState<string>(localStorage.getItem(Config().DASHBOARD_NAME) ?? 'ダッシュボード名')
  const [remoteVideo, setRemoteVideo] = useState<CameraStream[]>([]);
  const [meshRoom, setMeshRoom] = useState<MeshRoom>()
  const { hasCopied, onCopy } = useClipboard(`${window.location.href}/${localStorage.getItem(Config().DASHBOARD_ID) ?? ''}/name/${encodeURIComponent(dashboardName)}`)
  const navigate = useNavigate();
  const toast = useToast()

  const onStartStream = (roomId: string) => {
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
          { stream: stream, peerId: stream.peerId, config: null },
        ]);

        room.send({
          cmd: 'getUserAgent',
          peerId: stream.peerId,
          data: {}
        })
      })

      room.on('data', ({data, src}) => {
        if (!data?.cmd || (data?.peerId !== peer.current.id && !data?.broadcast)) return

        if (data.cmd === 'getUserAgent') {
          setRemoteVideo(prev => prev.map(videoData => {
            if (videoData.peerId === src) {
              videoData.config = data.data
            }
            return videoData
          }))
        }
        else if (data.cmd === 'removeCamera') {
          removeDashboardData()
        }
      })

      setMeshRoom(room)
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
    toast({
      position: 'bottom',
      description: (<><Spinner size='xs' /> サーバーに接続中... </>),
      duration: null,
    })

    const room = localStorage.getItem(Config().DASHBOARD_ID)
    if (room == null || room.length < 1) {
      window.location.href = '/'
      return
    }

    setTimeout(() => onStartStream(room), 1000)
  }, [])


  const onSetDashboardName = (name: string) => {
    if (name !== '') {
      setDashboardName(name)
      localStorage.setItem(Config().DASHBOARD_NAME, name)
    }
  }


  const showCamera = () => {
    if (remoteVideo.length > 0) {
      return remoteVideo.map((video) => {
        return <CameraCard video={video} key={video.peerId} room={meshRoom}/>;
      });
    }
    else {
      return <Box w='full' h='60vh'><Center>「カメラ追加」ボタンを押して、監視カメラを追加しよう！</Center></Box>
    }
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

  const onRemoveAllCamera = () => {
    if (window.confirm('全てのカメラを終了します。よろしいですか？')) {
      meshRoom?.send({
        cmd: 'removeCamera',
        broadcast: true,
        data: {}
      })
      removeDashboardData()
    }
  }

  const removeDashboardData = () => {
    localStorage.clear()
    window.location.replace('/')
  }

  return (
    <>
      <Header/>
        <Wrap justify={["center", "space-between"]} mr={5} ml={5}>
          <WrapItem>
            <Heading ml={2} mr={2} mt={4} size="md" color="gray.700">
              <Editable placeholder='ダッシュボード'  defaultValue={dashboardName} onSubmit={onSetDashboardName}>
                <EditablePreview />
                <EditableInput/>
              </Editable>
            </Heading>
          </WrapItem >
          <WrapItem >
            <Flex>
              <QRLinkModalButton/>
              <Menu>
                <MenuButton
                  mt={2}
                  mb={2}
                  as={Button}
                  variant="solid"
                  colorScheme="blue"
                  rightIcon={<ChevronDownIcon />}
                >
                  アクション 
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={onCopyUrl}><LinkIcon/>　リンクをコピー</MenuItem>
                  <MenuItem onClick={() => window.location.href = '/'}><ArrowBackIcon/>　ホームに戻る</MenuItem>
                  <MenuItem onClick={() => window.location.reload()}><RepeatIcon/>　サーバーに再接続</MenuItem>
                  <Divider mt={2} mb={2}/>
                  <MenuItem onClick={onRemoveAllCamera}><DeleteIcon/>　ダッシュボードを削除</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
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
  