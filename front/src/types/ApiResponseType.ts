import { FileType } from './FileType.ts';

export type ApiResponseType = {
  event: string;
  success: boolean;
  status: string;
  message: string;
  url?: string;
  file: FileType;
};
