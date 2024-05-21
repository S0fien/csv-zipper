import { JSX, ReactNode } from "react";

export type FeedbackMessageInterface = {
  message: JSX.Element,
  extra?: JSX.Element,
  subTitle: JSX.Element,
  status: string,
  icon?: ReactNode
}