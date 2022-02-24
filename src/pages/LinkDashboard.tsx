import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useNavigate, NavigateFunction } from "react-router-dom";
import { Helmet } from "react-helmet-async"

import Config from '../Config'

const LinkDashboard = () => {
  const params = useParams()
  const navigate = useNavigate()
  const roomId = params?.roomId ?? ''

  useEffect(() => {
    if (roomId.length <= 0) {
      navigate('/')
    }
  
    const nowRoomId = localStorage.getItem(Config().DASHBOARD_ID)
    if (nowRoomId && !window.confirm('移動先ダッシュボードに移動するには、今あるダッシュボードを削除する必要があります。削除しますか？')) {
      window.location.replace('/dashboard')
      return
    }

    localStorage.clear()
    localStorage.setItem(Config().DASHBOARD_ID, roomId)
    window.location.replace('/dashboard')
  }, [])

  return (<>
    <Helmet
      title={'Socket Cam - ダッシュボード共有'}
      meta={[
        { name: 'Socket Cam - ダッシュボード共有', content: 'ダッシュボードが共有されました。アクセスすると、設定された監視カメラを操作することができます。' }
      ]}
    /></>
  )
};

export default LinkDashboard;