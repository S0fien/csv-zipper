import { useContext } from "react";
import { FileContext } from "../context/FileContext.ts";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";

export const Status = () => {
  const [context, setContext] = useContext(FileContext);
  const { isUploading, isAwaitingServer, isDownloadReady, error } = context;
  if (isUploading)
    return (
      <Tag icon={<SyncOutlined spin />} color="processing">
        processing
      </Tag>
    );
  if (error)
    return (
      <Tag icon={<CloseCircleOutlined />} color="error">
        error
      </Tag>
    );
  if (isAwaitingServer)
    return (
      <Tag icon={<ClockCircleOutlined />} color="default">
        waiting
      </Tag>
    );
  if (isDownloadReady)
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        success
      </Tag>
    );
  return <></>;
};
