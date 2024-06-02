import Title from 'antd/lib/typography/Title';
import Links from '../components/Links.tsx';

const Heading = () => {
  return (
    <div style={{ padding: 10, marginBottom: 15 }}>
      <Title style={{ margin: 0, padding: 15 }}>CSV Zipper</Title>
      <Links />
    </div>
  );
};

export default Heading;
