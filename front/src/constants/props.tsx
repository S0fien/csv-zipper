import { AlertFilled, StarFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import { Status } from '../components/Status.tsx';
import { ResultStatusType } from './ResultType.ts';

const { Text } = Typography;

export const FEEDBACK_PROPS = {
  ERROR_MESSAGE_PROPS: (errorMessage: string) => ({
    subTitle: (
      <Text>
        Error message : <Text code>{errorMessage}</Text>
      </Text>
    ),
    status: 'error' as ResultStatusType,
    icon: <AlertFilled />,
    message: <Text>Oops! We may encounter tech problems.</Text>,
    extra: <Status />,
  }),
  UPLOADING_MESSAGE_PROPS: {
    extra: <Status />,
    status: 'info' as ResultStatusType,
    subTitle: <Text type={'secondary'}>It should be done anytime.</Text>,
    message: <Text>You're uploading your file to our server.</Text>,
  },
  DOWNLOADED_MESSAGE_PROPS: {
    extra: <Status />,
    icon: <StarFilled />,
    status: 'success' as ResultStatusType,
    message: <Text>We've successfully compressed your file.</Text>,
    subTitle: <Text type={'secondary'}>You can click the download button.</Text>,
  },
  COMPRESSION_MESSAGE_PROPS: {
    extra: <Status />,
    status: 'success' as ResultStatusType,
    message: <Text>We've successfully downloaded your file.</Text>,
    subTitle: <Text type={'secondary'}>Your file is now up to compression...</Text>,
  },
};
