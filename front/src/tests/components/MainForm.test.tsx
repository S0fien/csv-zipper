import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import MainForm from '../../pages/MainForm.tsx';
import { customRender } from '../tests-utils.tsx';
import userEvent from '@testing-library/user-event';

describe('MainForm Component', () => {

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
  });

  it('displays mainform with no result and no feedback', () => {

    customRender(
        <MainForm />
    );

    expect(screen.getAllByTestId('form-result')[0].innerText).toBe(undefined);
    expect(screen.getAllByTestId('feedback-message')[0].innerText).toBe(undefined);
  });

  it('displays an error message for oversized files', async () => {

    customRender(
        <MainForm />
    );

    const sizeInMegabytes = 400;
    const sizeInBytes = sizeInMegabytes * 1024 * 1024;
    const buffer = new ArrayBuffer(sizeInBytes);
    const file = new File([buffer], 'bigfile.csv', {
      type: 'text/csv',
    });
    const role = screen.getAllByTestId('upload-dragger')[0]
    await userEvent.upload(role, file)
    expect(screen.findByText(/Size too big/i)).toBeDefined();
  });
});
