import { Button, Typography } from "antd";
import React, { useContext } from "react";
import { FileContext } from "../context/FileContext.ts";
import useWebSocket from "../hooks/useWebSocket.ts";

const { Text } = Typography;

export const FormResult = () => {
  const [context] = useContext(FileContext);
  const { isOpen } = useWebSocket('ws://127.0.0.1:5599');
  const { isDownloadReady, downloadUrl} = context

  if (!isOpen) {
    return (
      <p className="ant-upload-text">Connecting to the WebSockets server...</p>
    )
  }
  if (isOpen && isDownloadReady) {
    return (
      <>
        <div>
        <Text type={'success'}>Archive is now ready !</Text>
        </div>
        <div>
          <Button type={'primary'} download={'file.zip'} href={downloadUrl}>
            Download your .ZIP
          </Button>
        </div>
      </>
    )}
}

export default FormResult