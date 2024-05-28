import { Button, Typography } from "antd";
import useWebSocket from "../hooks/useWebSocket.ts";
import URLS from "../constants/urls.ts";
import Title from "antd/lib/typography/Title";
import { FileContext } from "../contexts/FileContext.ts";
import { useContext } from "react";

const { Text } = Typography;

export const FormResult = () => {
  const [context] = useContext(FileContext);
  const { isOpen } = useWebSocket(URLS.WEBSOCKET_URL);
  const { isDownloadReady, downloadUrl } = context;

  if (!isOpen) {
    return <Text>Connecting to the WebSockets server...</Text>;
  }
  if (isDownloadReady) {
    return (
      <>
        <div>
          <Title level={3} type={'success'}>Archive is now ready !</Title>
          <Button type={'primary'} size={'large'} download={'zipped-csv.zip'} href={downloadUrl}>
            Download your .ZIP
          </Button>
        </div>
      </>
    );
  }
};

export default FormResult;
