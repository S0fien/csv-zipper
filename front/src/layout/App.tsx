import "../styles/App.css";
import { Layout } from "antd";
import Main from "./Main.tsx";
import Footer from "./Footer.tsx";
import { FileContext, store } from "../context/FileContext.ts";
import { useEffect, useState } from "react";

function App() {
  const [context, setContext] = useState(store);

  useEffect(() => {
    console.log('NEW CONTEXT', context)
  }, [context]);

  return (
    <>
      <FileContext.Provider value={[context, setContext]}>
        <Layout style={{ borderRadius: '20px' }}>
          <Main />
          <Footer />
        </Layout>
      </FileContext.Provider>
    </>
  );
}

export default App;
