import { message, Upload } from 'antd';
import axios from 'axios';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useContext } from 'react';
import { MAX_FILE_SIZE, MESSAGE_DURATION } from '../constants/rules.ts';
import URLS from '../constants/urls.ts';
import { FileContext } from '../contexts/FileContext.ts';
import { FileManipulation } from '../utils/fileManipulation.ts';
import UploadFieldContent from './UploadFieldContent.tsx';

message.config({ duration: MESSAGE_DURATION });

const UploadField = () => {
  const [context, setContext] = useContext(FileContext);
  const { isRequesting } = context;
  const customRequest = async (options: UploadRequestOption) => {
    const { file: fileFromOptions } = options;

    const file = fileFromOptions as File;
    setContext({
      ...context,
      isDownloadReady: false,
      downloadUrl: '',
      isRequesting: true,
      isUploading: true,
      error: false,
      file,
    });

    const uploadedSize = FileManipulation.sizeToMo(file['size']);
    if (uploadedSize > MAX_FILE_SIZE) {
      setContext({
        ...context,
        isDownloadReady: false,
        downloadUrl: '',
        isRequesting: false,
        isUploading: false,
        error: true,
        errorMessage: 'size too big',
        file,
      });
    } else {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await axios({
          method: 'POST',
          url: URLS.API_UPLOAD_URL,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setContext({
          ...context,
          isUploading: false,
          isAwaitingServer: true,
          isRequesting: true,
          error: false,
        });
      } catch (err) {
        const error = err as Error;
        setContext({
          ...context,
          isUploading: false,
          error: true,
          errorMessage: error.message,
          isDownloadReady: false,
          downloadUrl: '',
        });
      }
    }
  };

  return (
    <Upload.Dragger
      data-testid={'upload-dragger'}
      disabled={isRequesting}
      style={{ justifyContent: 'center' }}
      name="file"
      listType={'picture'}
      maxCount={1}
      accept={'.csv'}
      onChange={(info) => {
        const { status } = info.file;
        if (status === 'done') {
          message.success(`Your file ${info.file.name} has been downloaded successfully`);
        } else if (status === 'error') {
          message.error(`The upload of your file ${info.file.name} had failed.`);
        }
      }}
      showUploadList={false}
      customRequest={(options) => customRequest(options)}
    >
        <UploadFieldContent />
    </Upload.Dragger>
  );
};

export default UploadField;
