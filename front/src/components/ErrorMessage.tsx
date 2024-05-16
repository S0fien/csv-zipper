import { Result, Space, Typography } from "antd";
import { AlertFilled } from "@ant-design/icons";
import { ErrorMessageType } from "../types/ErrorMessageType.ts";

const { Text } = Typography

const ErrorMessage = ({ message }: ErrorMessageType) => {
  return (
    <div id={'errorMessage'}>
      <Result
        status={'warning'}
        icon={<AlertFilled size={50} />}
        title={'Oh, we may encounter tech problems.'}
        extra={
          <Space>
            <Text strong type={'warning'}>Serveur response : {message}</Text>
            <Text className="ant-upload-hint">Please try again.</Text>
          </Space>

        }
      />
    </div>
  );
};

export default ErrorMessage;
