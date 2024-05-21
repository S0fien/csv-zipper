import { ExceptionStatusType, ResultStatusType } from 'antd/es/result';
import { JSX, ReactNode } from 'react';

type WithoutException<T, U> = T extends U ? never : T;

type ResultStatusWithoutException = WithoutException<ResultStatusType, ExceptionStatusType>;

export type FeedbackMessageInterface = {
  message: JSX.Element;
  extra?: JSX.Element;
  subTitle: JSX.Element;
  status: ResultStatusWithoutException;
  icon?: ReactNode;
};
