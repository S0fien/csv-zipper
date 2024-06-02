import { FileType } from './FileType.ts';

export type ApiResponseType = {
  event: string;
  success: boolean;
  status: string;
  message: string;
  url?: string;
  filePath: string;
  file?: FileType;
};
