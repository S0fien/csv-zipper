import axios from "axios";
import { message, Upload } from "antd";
import UploadFieldContent from "./UploadFieldContent.tsx";
import UploadItem from "./UploadItem.tsx";
import { MAX_FILE_SIZE, MESSAGE_DURATION } from "../constants/rules.ts";
import { useContext } from "react";
import { FileContext } from "../context/FileContext.ts";
import { FileManipulation } from "../utils/fileManipulation.ts";

message.config({ duration: MESSAGE_DURATION });

const UploadField = () => {
  const [context, setContext] = useContext(FileContext);
  const { isRequesting } = context
  const customRequest = async (options) => {
    const { onSuccess, onError, file } = options;

    // file.fileName = options.fileName
    // file.size = options.size
    setContext({
      ...context,
      isRequesting: true,
      isUploading: true,
      error: null,
      file,
    });

    const uploadedSize = FileManipulation.sizeToMo(file);
    if (uploadedSize > MAX_FILE_SIZE) {
      onError('Size to big.')
    }
    else {
      const formData = new FormData();
      formData.append('file', file);
      console.log('working', file);
      try {
        await axios({
          method: 'POST',
          url: 'http://localhost:3000/upload',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setContext({
          ...context,
          isUploading: false,
          isAwaitingServer: true,
          error: null,
        });
        onSuccess()
      } catch (err) {
        setContext({
          ...context,
          isUploading: false,
          isRequesting: false,
          error: err.response.data.errorMessage,
        });
        onError('fsdfdsd');
      }
    }
  };

  return (
    <Upload.Dragger
      disabled={isRequesting}
      style={{ justifyContent: 'center' }}
      name="file"
      action="http://localhost:3000/upload"
      listType={'picture'}
      maxCount={1}
      onDownload={(e) => {
        console.log('drop', e);
      }}
      accept={'.csv'}
      onChange={(info) => {
        const { status } = info.file;
        if (status === 'done') {
          message.success(`Your file ${info.file.name} has been downloaded successfully`);
        } else if (status === 'error') {
          message.error(`The upload of your file ${info.file.name} had failed.`);
        }
      }}
      itemRender={() => <UploadItem />}
      customRequest={(options) => customRequest(options)}
    >
      <UploadFieldContent />
    </Upload.Dragger>
  );
};

export default UploadField;
