import { useContext, useEffect, useState } from "react";
import { FileContext } from "../contexts/FileContext";
import useWebSocket from "../hooks/useWebSocket";
import URLS from "../constants/urls.ts";
import { ApiResponseType } from "../types/ApiResponseType.ts";
import { FileManipulation } from "../utils/fileManipulation.ts";

const useFileHandler = () => {
  const [context, setContext] = useContext(FileContext);
  const { isRequesting, error, isDownloadReady, downloadUrl } = context;
  const [downloadMessage, setDownload] = useState<ApiResponseType>();
  const { messages } = useWebSocket(URLS.WEBSOCKET_URL);

  useEffect(() => {
    if (error?.message && !error) {
      setContext({ ...context, error });
      setDownload(undefined);
    }
  }, [context, error, error?.message, setContext]);

  useEffect(() => {
    if (downloadMessage && !isDownloadReady) {
      const url = FileManipulation.downloadLink(downloadMessage.file.data);
      setContext({
        ...context,
        isDownloadReady: true,
        downloadUrl: url,
        isRequesting: false,
      });
    }
  }, [context, downloadMessage, isDownloadReady, setContext]);

  useEffect(() => {
    if (messages) {
      messages.forEach((message: ApiResponseType) => {
        setDownload(message);
      });
    }
  }, [messages]);

  return {
    isRequesting,
    error,
    isDownloadReady,
    downloadUrl,
    downloadMessage,
  };
};

export default useFileHandler;
