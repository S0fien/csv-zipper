import { Content } from 'antd/es/layout/layout';
import { Flex } from 'antd';
import MainForm from '../pages/MainForm.tsx';

export const Main = () => {
  return (
    <Content style={{ padding: '0 48px', margin: '25px 0' }}>
      <Flex id={'form-container'} vertical>
        <MainForm />
      </Flex>
    </Content>
  );
};

export default Main;
