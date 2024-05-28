import { Result } from 'antd';
import { FeedbackMessageInterface } from '../types/FeedbackMessage.interface.ts';

const FeedbackMessage = ({ ...defaultProps }: FeedbackMessageInterface) => {

    return (
      <div data-testid={'feedback-message'}>
        <Result
          subTitle={defaultProps.subTitle}
          title={defaultProps.message}
          icon={defaultProps.icon || null}
          status={defaultProps.status}
          extra={defaultProps.extra}
        />
      </div>
    );
};

export default FeedbackMessage;
