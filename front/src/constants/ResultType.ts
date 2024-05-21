export declare const IconMap: {
  success: React.ForwardRefExoticComponent<
    Omit<import('@ant-design/icons/lib/components/AntdIcon').AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;
  error: React.ForwardRefExoticComponent<
    Omit<import('@ant-design/icons/lib/components/AntdIcon').AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;
  info: React.ForwardRefExoticComponent<
    Omit<import('@ant-design/icons/lib/components/AntdIcon').AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;
  warning: React.ForwardRefExoticComponent<
    Omit<import('@ant-design/icons/lib/components/AntdIcon').AntdIconProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
  >;
};

export type ResultStatusType = keyof typeof IconMap; // Exclure ExceptionStatusType
