import { FileAddOutlined } from '@ant-design/icons';

const UploadFieldContent = () => {
  return (
    <>
      <p className="ant-upload-drag-icon">
        <FileAddOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">Support only a single .CSV file</p>
    </>
  );
};

export default UploadFieldContent;
