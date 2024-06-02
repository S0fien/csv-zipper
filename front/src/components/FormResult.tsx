import { Button, Typography } from 'antd';
import useWebSocket from '../hooks/useWebSocket.ts';
import URLS from '../constants/urls.ts';
import Title from 'antd/lib/typography/Title';
import { FileContext } from '../contexts/FileContext.ts';
import { useContext } from 'react';
import axios from 'axios';

const { Text } = Typography;

export const FormResult = () => {
  const [context] = useContext(FileContext);
  const { isOpen } = useWebSocket(URLS.WEBSOCKET_URL);
  const { isDownloadReady, downloadUrl } = context;

  const onClick = async () => {
    try {
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
      });
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'archive.zip';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen) {
    return (
      <div data-testid={'form-result'}>
        <Text>Connecting to the WebSockets server...</Text>
      </div>
    );
  }
  if (isDownloadReady) {
    return (
      <div data-testid={'form-result'}>
        <Title level={3} type={'success'}>
          Archive is now ready !
        </Title>
        <Button type={'primary'} size={'large'} onClick={onClick}>
          Download your .ZIP
        </Button>
      </div>
    );
  }

  return <div data-testid={'form-result'} />;
};

export default FormResult;
