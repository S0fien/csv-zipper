import type fs from 'fs'

export interface onEndInterface {
  rowCount: number
  maleStream: fs.WriteStream
  femaleStream: fs.WriteStream
  file: any
}
