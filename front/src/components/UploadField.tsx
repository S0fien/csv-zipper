import axios from "axios";
import { message, Upload } from "antd";
import UploadFieldContent from "./UploadFieldContent.tsx";
import { MAX_FILE_SIZE, MESSAGE_DURATION } from "../constants/rules.ts";
import { useContext } from "react";
import { FileContext } from "../context/FileContext.ts";
import { FileManipulation } from "../utils/fileManipulation.ts";
import URLS from "../constants/urls.ts";

message.config({ duration: MESSAGE_DURATION });

const UploadField = () => {
  const [context, setContext] = useContext(FileContext);
  const { isRequesting } = context;
  const customRequest = async (options) => {
    const { onSuccess, onError, file } = options;

    setContext({
      ...context,
      isRequesting: true,
      isUploading: true,
      error: false,
      file
    });

    const uploadedSize = FileManipulation.sizeToMo(file.size);
    if (uploadedSize > MAX_FILE_SIZE) {
      onError('Size to big.');
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
        onSuccess();
      } catch (err) {
        setContext({
          ...context,
          isUploading: false,
          error: true,
        });
        onError();
      }
    }
  };

  return (
    <Upload.Dragger
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
