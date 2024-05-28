import React, { useEffect, useState } from 'react';
import { Divider, Form } from 'antd';
import UploadField from '../components/UploadField.tsx';
import FormFeedback from '../components/FormFeedback.tsx';
import FormResult from '../components/FormResult.tsx';
import useFileHandler from '../hooks/useFileHandler.ts';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const formStyles = { maxWidth: 600, margin: 'auto', justifyContent: 'center' };

const MainForm: React.FC = () => {
  const { isRequesting } = useFileHandler();

  const [request, setRequest] = useState(false);

  useEffect(() => {
    setRequest(isRequesting);
  }, [isRequesting]);

  return (
    <Form data-testid={'main-form'} disabled={request} name="validate_other" {...formItemLayout} style={formStyles}>
      <Form.Item name="dragger" valuePropName="file" style={{ justifyContent: 'center' }}>
        <UploadField />
      </Form.Item>
      <FormFeedback />
      <Divider />
      <FormResult />
    </Form>
  );
};

export default MainForm;
