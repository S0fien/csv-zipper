import { FileZipOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';

const Heading = () => {
  return (
    <Title copyable={{ icon: <FileZipOutlined /> }} style={{ padding: '48px' }}>
      CSV Zipper
    </Title>
  );
};

export default Heading;
