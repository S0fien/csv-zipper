import URLS from '../constants/urls.ts';

export const FileManipulation = {
  sizeToMo(file: number) {
    return Number.parseInt((file / 1024 / 1024).toFixed(2));
  },
  downloadLink(filePath: string) {
    return `${URLS.API_DOWNLOAD_URL}${filePath.split('/').pop()}`;
  }
};
