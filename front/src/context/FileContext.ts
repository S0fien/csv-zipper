import { createContext } from "react";

export const store = {
  isRequesting: false,
  isUploading: false,
  isAwaitingServer: false,
  error: false,
  isDownloadReady: false,
  downloadUrl: '',
  file: null,
  status: '',
};

export interface storeInterface {
  isRequesting: boolean;
  isUploading: boolean;
  isAwaitingServer: boolean;
  error?: boolean;
  isDownloadReady: boolean;
  downloadUrl?: string;
  file?: null;
  status: string;
}

// Todo: use replace never of createContext
export const FileContext = createContext<any>(store);
