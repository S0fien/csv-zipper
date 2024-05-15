import { Flex, Typography } from 'antd';
import { Footer as AntdFooter } from 'antd/lib/layout/layout';

const { Text, Link } = Typography;

export const Footer = () => {
  return (
    <AntdFooter>
      <Flex justify={'center'} align={'center'}>
        <Text code>
          Created by{' '}
          <Link href="https://github.com/S0fien" target="_blank">
            S0fien
          </Link>
        </Text>
      </Flex>
    </AntdFooter>
  );
};

export default Footer;
