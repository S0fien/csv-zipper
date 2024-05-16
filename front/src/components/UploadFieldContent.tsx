import { FileAddOutlined } from "@ant-design/icons";
import { MAX_FILE_SIZE } from "../constants/rules.ts";

const UploadFieldContent = () => {
  return (
    <>
      <p className="ant-upload-drag-icon">
        <FileAddOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-text">Support only a single .CSV file with a limit of {MAX_FILE_SIZE}/mb per file.</p>
    </>
  );
};

export default UploadFieldContent;
