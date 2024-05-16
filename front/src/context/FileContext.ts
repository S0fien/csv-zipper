import { createContext } from "react";

export const store = {
  isRequesting: false,
  isUploading: false,
  isAwaitingServer: false,
  error: null,
  isDownloadReady: false,
  downloadUrl: '',
  file: null,
};
export const FileContext = createContext({});
