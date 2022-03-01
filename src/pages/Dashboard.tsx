import { useState, useRef, useEffect, RefObject } from 'react'
import { Helmet } from "react-helmet-async"
import { usePageVisibility } from 'react-page-visibility';

import { GiSpeaker } from 'react-icons/gi'
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
import { RiVideoAddFill } from 'react-icons/ri'

import Config, {CameraStream, getDateTime, DashboardConfig} from '../Config'
import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import CameraCard from '../components/Items/CameraCard'
import QRLinkModalButton from '../components/Items/QRLinkModalButton'
import DashboardConnection from '../components/Items/DashboardConnection'

import Peer, {MeshRoom} from 'skyway-js'


const Dashboard = () => {
  const peer = useRef(new Peer({ key: Config().SKYWAY_API_KEY, debug: 0 }));
  const [dashboardName, setDashboardName] = useState<string>(localStorage.getItem(Config().DASHBOARD_NAME) ?? '新規のダッシュボードさん')
  const [joinedDate, setJoinedDate] = useState<string>(getDateTime(false))
  const [remoteVideo, setRemoteVideo] = useState<CameraStream[]>([]);
  const [remoteDashboard, setRemoteDashboard] = useState<DashboardConfig[]>([]);
  const [meshRoom, setMeshRoom] = useState<MeshRoom>()
  const [roomId, setRoomId] = useState<string>(localStorage.getItem(Config().DASHBOARD_ID) ?? '')
  const [isSmartPhone] = useState<boolean>(/iPhone|Android|iPad/.test(navigator.userAgent))
  const isVisible = usePageVisibility()
  const [firstVisible, setFirstVisible] = useState<boolean>(true)
  const toast = useToast()

  useEffect(() => {
    if (!isVisible || !isSmartPhone) return
    else if (isVisible && firstVisible) {
      setFirstVisible(false)
      return
    }

    reconnectRoom()
  }, [isVisible])

  const reconnectRoom = () => {
    window.location.reload()
  }

  const onStartStream = () => {
    try {
      const room = peer.current.joinRoom(roomId, {
        mode: 'mesh'
      })

      room.once('open', () => {
        onToastShow('ルームに接続しました。', null)

        setJoinedDate(getDateTime(false))
        room.send({
          cmd: 'getDashboardConfig',
          broadcast: true,
          data: {}
        })
      });

      room.on('peerJoin', peerId => {
        console.log(peerId)

        room.send({
          cmd: 'getDashboardConfig',
          peerId: peerId,
          data: {}
        })
      });

      room.on('peerLeave', (peerId) => {
        setRemoteVideo((prev) => {
          return prev.filter((video) => {
            if (video.peerId === peerId) {
              video.stream.getTracks().forEach((track) => track.stop());
              onToastShow(`${video?.config?.name}`, 'カメラが切断されました。', true)
            }
            return video.peerId !== peerId
          })
        })
        setRemoteDashboard((prev) => {
          return prev.filter((dashboard) => {
            if (dashboard.peerId === peerId) {
              onToastShow(`${dashboard?.config?.name}`, 'ダッシュボードが切断されました。', true)
            }
            return dashboard.peerId !== peerId
          })
        })
      })

      room.on('stream', async (stream) => {
        setRemoteVideo((prev) => [
          ...prev,
          { stream: stream, peerId: stream.peerId, config: null, camera: null, images: [null]},
        ]);

        room.send({
          cmd: 'getConfig',
          peerId: stream.peerId,
          data: {}
        })
      })

      // ルーム内コマンド受信
      room.on('data', ({data, src}) => {
        if (!data?.cmd || (data?.peerId !== peer.current.id && !data?.broadcast)) return

        if (data.cmd === 'setConfig') {
          setRemoteVideo(prev => prev.map(videoData => {
            if (videoData.peerId === src) {
              videoData.config = data.data.config
              videoData.camera = data.data.camera
            }
            return videoData
          }))
          onToastShow(`${data.data.config.name}`, 'カメラが接続されました。')
        }
        if (data.cmd === 'setDashboardName') {
          setRemoteDashboard(prev => prev.map(dashboard => {
            if (dashboard.peerId === src) {
              dashboard.config.name = data.data.name
            }
            return dashboard
          }))
        }
        else if (data.cmd === 'setDashboardConfig') {
          setRemoteDashboard((prev: DashboardConfig[]) => {
            if (prev.filter(data => data.peerId === src).length === 0) {
              return [...prev, {
                peerId: src,
                config: data.data.config
              },]
            }
            return prev
          })
          onToastShow(`${data.data.config.name}`, 'ダッシュボードが接続されました。')
        }
        else if (data.cmd === 'getDashboardConfig') {
          room.send({
            cmd: 'setDashboardConfig',
            status: 'success',
            peerId: src,
            data: {
              config: {
                userAgent: window.navigator.userAgent,
                name: dashboardName,
                joinedDate: joinedDate
              }
            }
          })
        }
        else if (data.cmd === 'removeCamera') {
          removeDashboardData()
        }
      })

      setMeshRoom(room)
    } catch (error) {
      console.log(error)
      toast.closeAll()
      onToastShow('ルームに接続できませんでした。5秒後に再接続します...', null, true)

      setTimeout(() => {
        window.location.reload()
      }, 5000)
    }
  }

  useEffect(() => {
    toast({
      position: 'bottom',
      description: (<><Spinner size='xs' /> ルームに接続中... </>),
      duration: null,
    })

    if (roomId === '') {
      window.location.replace('/')
      return
    }

    setTimeout(() => onStartStream(), 1500)
  }, [])

  const onToastShow = (description: string, title: string|null = null,  isError: boolean = false) => {
    toast.closeAll()
    toast({
      position: 'bottom',
      title: title,
      description: description,
      status: isError ? 'error' : 'success',
      duration: 3000,
    })
  }


  const onSetDashboardName = (name: string) => {
    if (name !== '') {
      setDashboardName(name)
      localStorage.setItem(Config().DASHBOARD_NAME, name)
      meshRoom?.send({
        cmd: 'setDashboardName',
        broadcast: true,
        data: {
          name: name
        }
      })
    }
  }


  const showCamera = () => {
    if (remoteVideo.length > 0) {
      return remoteVideo.map((video) => {
        return <CameraCard video={video} key={video.peerId} room={meshRoom} toastShow={onToastShow} dashboardName={dashboardName}/>;
      });
    }
    else {
      return <Box w='full' h='60vh'><Center>「カメラ追加」ボタンを押して、監視カメラを追加しよう！</Center></Box>
    }
  };

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

  const onSoundBroadCast = () => {
    if (window.confirm('本当に全てのカメラに対して音を鳴らしますか？')) {
      meshRoom?.send({
        cmd: 'soundBeep',
        broadcast: true,
        data: {}
      })
    }
  }

  return (
    <>
      <Helmet
        title={'Socket Cam - ダッシュボード'}
        meta={[
          { name: 'Socket Cam - ダッシュボード', content: 'あなたのスマホを監視カメラ代わりに。' }
        ]}
      />
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
              <QRLinkModalButton 
                buttonElement={(onOpen: React.MouseEventHandler<HTMLButtonElement>) => {
                  return (
                    <Button m={2} colorScheme="teal" mt={2} mb={2} rightIcon={<RiVideoAddFill/>}onClick={onOpen}> カメラ追加 </Button>
                  )
                }} 
                title='監視カメラを追加' 
                url={`${window.location.origin}/room/${localStorage.getItem(Config().DASHBOARD_ID) ?? ''}/camera`}
              />
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
                  <MenuItem onClick={() => window.location.href = '/'}><ArrowBackIcon/>　ホームに戻る</MenuItem>
                  <QRLinkModalButton 
                    buttonElement={(onOpen: React.MouseEventHandler<HTMLButtonElement>) => {
                      return (
                        <MenuItem onClick={onOpen}><LinkIcon/>　ダッシュボードを共有</MenuItem>
                      )
                    }} 
                    title='ダッシュボードを共有' 
                    url={`${window.location.href}/${localStorage.getItem(Config().DASHBOARD_ID) ?? ''}`}
                  />
                  <MenuItem onClick={onSoundBroadCast}><GiSpeaker/>　全体に音を鳴らす</MenuItem>
                  <MenuItem onClick={() => reconnectRoom()}><RepeatIcon/>　ルームに再接続</MenuItem>
                  <Divider mt={2} mb={2}/>
                  <MenuItem onClick={onRemoveAllCamera}><DeleteIcon/>　ダッシュボードを削除</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </WrapItem >
        </Wrap>
        <Box h="3px" m={2} bg="blue.400"/>
        <DashboardConnection dashboardName={dashboardName} remoteDashboard={remoteDashboard} remoteVideo={remoteVideo}/>
        <Wrap m={5}>
          {showCamera()}
        </Wrap>
        
      <Footer/>
    </>
  );
}

export default Dashboard;
  