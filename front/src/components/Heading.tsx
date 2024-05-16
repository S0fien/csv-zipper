import { FileZipOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';

const Heading = () => {
  return (
    <div style={{ padding: 10, marginBottom: 15 }}>
      <FileZipOutlined style={{ fontSize: '3em', color: 'blueviolet' }} />
      <Title style={{ margin: 0, padding: 15 }}>CSV Zipper</Title>
    </div>
  );
};

export default Heading;
