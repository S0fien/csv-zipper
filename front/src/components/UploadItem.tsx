import { FileZipOutlined } from "@ant-design/icons";
import { Card, Flex, Space, Spin, Typography } from "antd";
import React, { useContext } from "react";
import { FileContext } from "../context/FileContext.ts";
import { FileManipulation } from "../utils/fileManipulation.ts";
import { Status } from "./Status.tsx";

const { Text } = Typography;
const { Meta } = Card;

const UploadItem = () => {
  const [context, setContext] = useContext(FileContext);
  const { isUploading, file } = context;

  const uploadedSize = FileManipulation.sizeToMo(file);

  if (file)
    return (
      <Card hoverable style={{ width: 240, marginTop: 15 }}>
        <Space direction="vertical" size="small">
          <FileZipOutlined style={{ fontSize: '1.75em' }} />
          <Meta title={`Name: ${file.name}`} description={`Size : ${uploadedSize}MB`} />
          <Flex justify={'center'}>
            <Space>
              <Text>Status:</Text>
              <Status />
            </Space>
          </Flex>
        </Space>
        {isUploading && <Spin />}
      </Card>
    );
  else {
    return null;
  }
};

export default UploadItem;
