import { Button, Typography } from 'antd';
import useWebSocket from '../hooks/useWebSocket.ts';
import URLS from '../constants/urls.ts';
import Title from 'antd/lib/typography/Title';
import { FileContext } from '../contexts/FileContext.ts';
import { useContext } from 'react';

const { Text } = Typography;

export const FormResult = () => {
  const [context] = useContext(FileContext);
  const { isOpen } = useWebSocket(URLS.WEBSOCKET_URL);
  const { isDownloadReady, downloadUrl } = context;

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
        <Button type={'primary'} size={'large'} download={'zipped-csv.zip'} href={downloadUrl}>
          Download your .ZIP
        </Button>
      </div>
    );
  }

  return <div data-testid={'form-result'} />;
};

export default FormResult;
