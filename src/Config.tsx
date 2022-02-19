
const Config = () => {
  if (process.env.NODE_ENV === 'production') {
    return { 
      SKYWAY_API_KEY: 'a0d9d960-69cd-4941-9eda-26d6cc8385bd',
      DASHBOARD_ID: 'dashboardRoomId',
      DASHBOARD_NAME: 'dashboardName'
    }
  }
  else { 
    return {
      SKYWAY_API_KEY: 'a0d9d960-69cd-4941-9eda-26d6cc8385bd',
      DASHBOARD_ID: 'dashboardRoomId',
      DASHBOARD_NAME: 'dashboardName'
    }
  }
}

export type CameraStream = {
  stream: MediaStream;
  peerId: string;
  config: {
    userAgent: string
    cameraIndex: number
    cameraDevices: [{
      text: string
      id: string
    }]
  } | null
};

export default Config