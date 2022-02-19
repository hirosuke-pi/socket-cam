import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useNavigate, NavigateFunction } from "react-router-dom";

import Config from '../Config'

const LinkDashboard = () => {
  const params = useParams()
  const navigate = useNavigate()
  const roomId = params?.roomId ?? ''
  const dashboardName = params?.dashboardName ?? ''

  useEffect(() => {
    if (roomId.length <= 0) {
      navigate('/')
    }
  
    const nowRoomId = localStorage.getItem(Config().DASHBOARD_ID)
    if (nowRoomId && !window.confirm('移動先ダッシュボードに移動するには、今あるダッシュボードを削除する必要があります。削除しますか？')) {
      window.location.replace('/dashboard')
      return
    }

    localStorage.setItem(Config().DASHBOARD_NAME, decodeURIComponent(dashboardName))
    localStorage.setItem(Config().DASHBOARD_ID, roomId)
    window.location.replace('/dashboard')
  }, [])

  return <></>
};

export default LinkDashboard;