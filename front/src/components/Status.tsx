import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { FileContext } from "../contexts/FileContext.ts";
import { useContext } from "react";

export const Status = () => {
  const [context] = useContext(FileContext);

  const { isUploading, isAwaitingServer, isDownloadReady, error } = context;
  if (isUploading)
    return (
      <Tag icon={<UploadOutlined />} color="processing" style={{fontSize: '1.5em', padding: '0.5em'}}>
        uploading
      </Tag>
    );
  if (error)
    return (
      <Tag icon={<CloseCircleOutlined />} color="error" style={{fontSize: '1.5em', padding: '0.5em'}}>
        error
      </Tag>
    );
  if (isDownloadReady)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success" style={{fontSize: '1.5em', padding: '0.5em'}}>
        success
      </Tag>
    );
  if (isAwaitingServer)
    return (
      <Tag icon={<ClockCircleOutlined />} color="default" style={{fontSize: '1.5em', padding: '0.5em'}}>
        processing
      </Tag>
    );

};
