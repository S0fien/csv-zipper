import { Result, Typography } from 'antd';

const { Text } = Typography;
const ErrorMessage = ({ message }) => {
  return (
    <>
      <Result status={'error'} title={'Oups, on a un soucis.'} extra={<Text type={'danger'}>{message}</Text>} />
    </>
  );
};

export default ErrorMessage;
