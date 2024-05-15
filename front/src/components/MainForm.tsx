import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import UploadField from './UploadField.tsx';
import ErrorMessage from './ErrorMessage.tsx';
import useWebSocket from '../hooks/useWebSocket.ts';
import { ApiResponse } from '../types/ApiResponse.ts';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.file;
};

const MainForm: React.FC = () => {
  const [link, setLink] = useState<string>('');
  const [downloadMessage, setDownload] = useState<string>(null);
  const [errorMessage, setError] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const { messages, isOpen } = useWebSocket('ws://localhost:8080');

  // @ts-ignore
  const downloadLink = (data) => {
    const url = window.URL.createObjectURL(new Blob([new Uint8Array(data)]));
    setLink(url);
  };
  useEffect(() => {
    if (errorMessage) {
      setLink('');
      setDownload('');
    }
  }, [errorMessage]);
  useEffect(() => {
    if (downloadMessage) {
      downloadLink(downloadMessage.file.data);
      setUploading(false);
      // downloadFile().then((res) => console.log(res))
    }
  }, [downloadMessage]);
  useEffect(() => {
    if (messages) {
      console.log('new messages', messages);
      messages.forEach((message: ApiResponse) => {
        setDownload(message);
      });
    } else {
      console.log('no message');
    }
  }, [messages]);
  // @ts-ignore
  return (
    <Form
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
        <Form.Item
          name="dragger"
          valuePropName="file"
          getValueFromEvent={normFile}
          style={{ justifyContent: 'center' }}
          rootClassName={'testdsffsfd4'}
        >
          <UploadField setError={setError} setUploading={setUploading} />
        </Form.Item>
      </Form.Item>
      {uploading && <p>Votre fichier est en cours de compression...</p>}
      {errorMessage && <ErrorMessage message={errorMessage} />}
      {isOpen ? (
        link && (
          <>
            <p>Archive is now ready !</p>
            <p>
              <a download={'file.zip'} href={link}>
                Download your .ZIP
              </a>
            </p>
          </>
        )
      ) : (
        <p>Connecting...</p>
      )}
    </Form>
  );
};

export default MainForm;
