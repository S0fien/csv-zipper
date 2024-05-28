import "../styles/App.css";
import { Layout } from "antd";
import Main from "./Main.tsx";
import Footer from "./Footer.tsx";
import { FileContext, store, storeInterface } from "../contexts/FileContext.ts";
import { useState } from "react";

function App() {
  const [context, setContext] = useState<storeInterface>(store);

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
