import React from "react";
import { Divider, Form } from "antd";
import UploadField from "../components/UploadField.tsx";
import FormFeedback from "../components/FormFeedback.tsx";
import FormResult from "../components/FormResult.tsx";
import useFileHandler from "../hooks/useFileHandler.ts";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const MainForm: React.FC = () => {

  const { isRequesting } = useFileHandler();

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
