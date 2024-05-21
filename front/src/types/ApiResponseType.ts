type FileType = {
  path: string
  name: string
  data: ArrayBuffer,
}

export type ApiResponseType = {
  event: string;
  success: boolean;
  status: string;
  message: string;
  url?: string;
  file: FileType;
};
