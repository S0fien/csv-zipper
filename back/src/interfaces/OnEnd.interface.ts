import type fs from 'fs';

export interface OnEndInterface {
  maleStream: fs.WriteStream;
  femaleStream: fs.WriteStream;
  file: Express.Request['file'];
}
