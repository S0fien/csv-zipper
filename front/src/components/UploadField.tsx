import axios from 'axios';
import { message, Upload } from 'antd';
import UploadFieldContent from './UploadFieldContent.tsx';

const MESSAGE_DURATION = 10;
message.config({ duration: MESSAGE_DURATION });

const UploadField = ({ setError, setUploading }) => {
  const customRequest = async (options) => {
    setError('');
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('file', file);
    console.log('working');
    try {
      await axios({
        method: 'POST',
        url: 'http://localhost:3000/upload',
        data: formData,
        // responseType: 'blob', // Important pour traiter le flux binaire de la réponse
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSuccess();
      setUploading(true);
    } catch (err) {
      console.log('err', err);
      // @ts-ignore
      // console.log('ERRROR', err.response.data.errorMessage)
      // @ts-ignore
      // console.log('ERRROR', err.message)
      // @ts-ignore
      setError(err.response.data.errorMessage);
      // @ts-ignore
      // onError({ err: err.message });
    }
  };

  return (
    <Upload.Dragger
      style={{ justifyContent: 'center' }}
      name="file"
      action="http://localhost:3000/upload"
      listType={'picture'}
      maxCount={1}
      accept={'.csv'}
      onChange={(info) => {
        const { status } = info.file;
        console.log('status is ', status);
        if (status !== 'uploading') {
          console.log('still uploading... ', info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`Zipped ${info.file.name} file downloaded successfully`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }}
      customRequest={(options) => customRequest(options)}
      onDrop={(e) => {
        console.log('Dropped files', e.dataTransfer.files);
      }}
    >
      <UploadFieldContent />
    </Upload.Dragger>
  );
};

export default UploadField;
