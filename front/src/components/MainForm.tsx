import React, { useContext, useEffect, useState } from "react";
import { Divider, Form } from "antd";
import UploadField from "./UploadField.tsx";
import useWebSocket from "../hooks/useWebSocket.ts";
import { ApiResponseType } from "../types/ApiResponseType.ts";
import { FileContext } from "../context/FileContext.ts";
import FormFeedback from "./FormFeedback.tsx";
import { FileManipulation } from "../utils/fileManipulation.ts";
import FormResult from "./FormResult.tsx";
import URLS from "../constants/urls.ts";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const MainForm: React.FC = () => {
  const [context, setContext] = useContext(FileContext);
  const { isRequesting, error, isDownloadReady, downloadUrl } = context;
  const [downloadMessage, setDownload] = useState<ApiResponseType>();
  const { messages } = useWebSocket(URLS.WEBSOCKET_URL);

  useEffect(() => {
    if (error?.message && !error) {
      setContext({ ...context, error });
      setDownload(undefined);
    }
  }, [context, error, error?.message, setContext]);
  useEffect(() => {
    if (downloadMessage && !isDownloadReady) {
      const url = FileManipulation.downloadLink(downloadMessage.file.data);
      setContext({
        ...context,
        isDownloadReady: true,
        downloadUrl: url,
        isRequesting: false
      });
    }
  }, [context, downloadUrl, downloadMessage, isDownloadReady, setContext]);
  useEffect(() => {
    if (messages) {
      messages.forEach((message: ApiResponseType) => {
        setDownload(message);
      });
    }
  }, [messages]);
  return (
    <Form
      disabled={isRequesting}
      name="validate_other"
      {...formItemLayout}
      initialValues={{
        'input-number': 3,
        'checkbox-group': ['A', 'B'],
        rate: 3.5,
        'color-picker': null,
      }}
      style={{ maxWidth: 600, margin: 'auto', justifyContent: 'center' }}
    >
      <Form.Item rootClassName={'upload-container'}>
        <Form.Item name="dragger" valuePropName="file" style={{ justifyContent: 'center' }}>
          <UploadField />
        </Form.Item>
      </Form.Item>
      <FormFeedback />
      <Divider />
      <FormResult />
    </Form>
  );
};

export default MainForm;
