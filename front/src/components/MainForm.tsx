import React, { useContext, useEffect, useState } from "react";
import { Form, Typography } from "antd";
import UploadField from "./UploadField.tsx";
import useWebSocket from "../hooks/useWebSocket.ts";
import { ApiResponseType } from "../types/ApiResponseType.ts";
import { FileContext } from "../context/FileContext.ts";
import FormFeedback from "./FormFeedback.tsx";
import { FileManipulation } from "../utils/fileManipulation.ts";
import FormResult from "./FormResult.tsx";

const { Text } = Typography;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const MainForm: React.FC = () => {
  const [context, setContext] = useContext(FileContext);
  const { isUploading, error, isDownloadReady, downloadLink } = context;
  const [downloadMessage, setDownload] = useState<ApiResponseType>();
  const { messages } = useWebSocket('ws://127.0.0.1:5599');



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
        file: downloadMessage.file,
        downloadUrl: url
      });

    }
  }, [context, downloadLink, downloadMessage, isDownloadReady, setContext]);
  useEffect(() => {
    if (messages) {
      messages.forEach((message: ApiResponseType) => {
        setDownload(message);
      });
    }
  }, [messages]);
  return (
    <Form
      disabled={isUploading}
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
        <Form.Item name="dragger" valuePropName="file" style={{ justifyContent: 'center' }} rootClassName={'testdsffsfd4'}>
          <UploadField />
        </Form.Item>
      </Form.Item>
      <FormFeedback />
      <FormResult />
    </Form>
  );
};

export default MainForm;
