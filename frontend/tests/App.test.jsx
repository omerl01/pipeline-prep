import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeAll, afterEach, vi } from 'vitest';
import App from '../src/App';

// Mock global.fetch to prevent making actual HTTP requests
beforeAll(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('/questions')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, topic: 'k8s', question_text: 'What is a Pod?', answer_text: 'Smallest deployable unit.', is_approved: true }
        ])
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

describe('PipelinePrep Frontend App tests', () => {
  test('renders header and logo title', async () => {
    render(<App />);
    expect(screen.getByText('PipelinePrep')).toBeInTheDocument();
    await screen.findByText('Master Your DevOps & SRE Interviews');
  });

  test('renders domains list', async () => {
    render(<App />);
    await screen.findByText('Select a Domain');
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    expect(screen.getByText('Linux Internals')).toBeInTheDocument();
  });

  test('navigates to contribute page and shows form inputs', async () => {
    render(<App />);
    await screen.findByText('Select a Domain');
    const contributeBtn = screen.getByRole('button', { name: /contribute/i });
    fireEvent.click(contributeBtn);
    
    // Check if the contribute form inputs exist
    await screen.findByText('Contribute a DevOps Question');
    expect(screen.getByLabelText('Interview Question')).toBeInTheDocument();
    expect(screen.getByLabelText('Verified Ideal Answer')).toBeInTheDocument();
  });

  test('navigates to admin portal login', async () => {
    render(<App />);
    await screen.findByText('Select a Domain');
    const adminBtn = screen.getByRole('button', { name: /admin portal/i });
    fireEvent.click(adminBtn);
    
    // Check if admin login form renders
    await screen.findByText('Administrator Portal');
    expect(screen.getByLabelText('Admin Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Secure Password')).toBeInTheDocument();
  });
});
