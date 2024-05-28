import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import MainForm from '../../src/pages/MainForm';
import { customRender } from '../tests-utils';
import userEvent from '@testing-library/user-event';

describe('MainForm Component', () => {
  const createPdf = (size: number, filename: string) => {
    const sizeInBytes = size * 1024 * 1024;
    const buffer = new ArrayBuffer(sizeInBytes);
    return new File([buffer], filename, {
      type: 'text/csv',
    });
  };

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    customRender(<MainForm />);
  });

  it('displays initial state mainform with no result and no feedback', () => {
    expect(screen.getAllByTestId('form-result')[0].innerText).toBe(undefined);
    expect(screen.getAllByTestId('feedback-message')[0].innerText).toBe(undefined);
  });

  it('displays a disabled form while requesting server', async () => {
    const file = createPdf(10, 'file.csv');
    const uploadDragger = screen.getAllByTestId('upload-dragger')[0];
    await userEvent.upload(uploadDragger, file);
    expect(screen.getAllByRole('button')[0].className).toContain('ant-upload-disabled');
  });

  it('displays an error message for oversized files', async () => {
    const file = createPdf(400, 'big_file.csv');
    const role = screen.getAllByTestId('upload-dragger')[0];
    await userEvent.upload(role, file);
    expect(screen.findByText(/Size too big/i)).toBeDefined();
  });
});
