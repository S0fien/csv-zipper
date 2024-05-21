import { FileZipOutlined } from "@ant-design/icons";
import { MAX_FILE_SIZE } from "../constants/rules.ts";
import { Space, Typography } from "antd";

const { Text } = Typography;

const UploadFieldContent = () => {
  return (
    <Space direction={'vertical'}>
      <FileZipOutlined style={{ fontSize: '3em', color: 'blueviolet' }} />
      <Text type={'secondary'}>Click or drag file to this area to upload</Text>
      <Text>Support only a single .CSV file with a
        <Text strong style={{fontSize: '1.25em'}}> limit of {MAX_FILE_SIZE}/mb per file.</Text> </Text>
    </Space>
  );
};

export default UploadFieldContent;
