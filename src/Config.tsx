
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

export const getDateTime = (isFileName: boolean = true): string => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const MM = ('0' + (d.getMonth() + 1)).slice(-2);
  const dd = ('0' + d.getDate()).slice(-2);
  const hh = ('0' + d.getHours()).slice(-2);
  const mm = ('0' + d.getMinutes()).slice(-2);
  const ss = ('0' + d.getSeconds()).slice(-2);

  if (isFileName) {
    return yyyy + '-' + MM + '-' + dd + '_' + hh + '-' + mm + '-' + ss;
  }
  return yyyy + '/' + MM + '/' + dd + ' ' + hh + ':' + mm + ':' + ss;
}

export type CameraStream = {
  stream: MediaStream;
  peerId: string;
  config: {
    name: string
    joinedDate: string,
    userAgent: string
  } | null
  camera: {
    index: number
    devices: [{
      text: string
      id: string
    }]
  } | null
  images: string[]
};

export type DashboardConfig = {
  peerId: string;
  config: {
    name: string
    joinedDate: string,
    userAgent: string
  }
}

export default Config