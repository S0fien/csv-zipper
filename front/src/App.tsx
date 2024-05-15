import './App.css';
import { Layout } from 'antd';
import Main from './layout/Main.tsx';
import Footer from './layout/Footer.tsx';

function App() {
  return (
    <>
      <Layout style={{ borderRadius: '20px' }}>
        <Main />
        <Footer />
      </Layout>
    </>
  );
}

export default App;
