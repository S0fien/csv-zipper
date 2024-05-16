export const FileManipulation = {
  sizeToMo(file) {
    return Number.parseInt((file / 1024 / 1024).toFixed(2));
  },
  downloadLink(data: ArrayBuffer) {
    return window.URL.createObjectURL(new Blob([new Uint8Array(data)]))
  }
};
