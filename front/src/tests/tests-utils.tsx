import { PropsWithChildren, ReactElement, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FileContext, store, storeInterface } from '../contexts/FileContext';
import { render, RenderOptions } from '@testing-library/react';

const queryClient = new QueryClient();

const AllTheProviders = ({children}: PropsWithChildren): JSX.Element => {
  const [context, setContext] = useState<storeInterface>(store);

  return (
    <QueryClientProvider client={queryClient}>
      <FileContext.Provider value={[context, setContext]}>
        {children}
      </FileContext.Provider>
    </QueryClientProvider>
  )
}

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: AllTheProviders, ...options})