import { useContext } from 'react';
import { FEEDBACK_PROPS } from '../constants/props.tsx';
import { FileContext } from '../context/FileContext.ts';
import FeedbackMessage from './FeedbackMessage.tsx';

const FormFeedback = () => {
  const [context] = useContext(FileContext);

  const { isUploading, error, isAwaitingServer, downloadUrl } = context;

  if (error) return <FeedbackMessage {...FEEDBACK_PROPS.ERROR_MESSAGE_PROPS} />;

  if (isUploading) return <FeedbackMessage {...FEEDBACK_PROPS.UPLOADING_MESSAGE_PROPS} />;

  if (!isUploading && isAwaitingServer && !downloadUrl) return <FeedbackMessage {...FEEDBACK_PROPS.COMPRESSION_MESSAGE_PROPS} />;

  if (downloadUrl) return <FeedbackMessage {...FEEDBACK_PROPS.DOWNLOADED_MESSAGE_PROPS} />;
};

export default FormFeedback;
