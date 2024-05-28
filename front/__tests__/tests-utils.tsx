import { PropsWithChildren, ReactElement, useState } from 'react';
import { FileContext, store, storeInterface } from '../src/contexts/FileContext';
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders = ({ children }: PropsWithChildren): JSX.Element => {
  const [context, setContext] = useState<storeInterface>(store);

  return (
      <FileContext.Provider value={[context, setContext]}>{children}</FileContext.Provider>
  );
};

export const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllTheProviders, ...options });
