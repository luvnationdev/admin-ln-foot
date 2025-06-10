// components/Posts/PostEditor.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostEditor from './PostEditor'; // Assuming PostEditor is the main export, changed from {PostEditor}
import { trpc } from '@/lib/trpc/react'; // For tRPC hook mocking
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
// Assuming useUploadFile is the hook for uploads, adjust if it's useUploadThing or other
// The actual component uses direct FileReader, not a hook like useUploadFile for the featured image.
// So, useUploadFile mock might not be directly relevant for the featured image part.

// --- Mocks ---
jest.mock('@/lib/trpc/react', () => ({
  trpc: {
    newsArticles: { // Assuming it's newsArticles based on component's usage
      createNewsArticle: {
        useMutation: jest.fn(),
      },
    },
    // Mock other trpc hooks if PostEditor uses them
  },
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    // loading: jest.fn(), // Not used in current tests, can add if needed
    // dismiss: jest.fn(), // Not used in current tests
  },
}));

jest.mock('dompurify', () => ({
  sanitize: jest.fn((html) => html), // Simple pass-through mock, just to check it's called
}));

// Mock the Tiptap editor
const mockEditor = {
  getHTML: jest.fn(() => '<p>Test editor content</p>'),
  getText: jest.fn(() => 'Test editor content'), // Added for completeness, though not directly tested here
  isEmpty: false, // Default to not empty
  commands: { // Mocking commands object and its methods
    setContent: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    clearContent: jest.fn().mockReturnThis(),
    toggleBold: jest.fn().mockReturnThis(),
    toggleItalic: jest.fn().mockReturnThis(),
    toggleBulletList: jest.fn().mockReturnThis(),
    toggleOrderedList: jest.fn().mockReturnThis(),
    setImage: jest.fn().mockReturnThis(),
    run: jest.fn().mockReturnThis(), // chainable methods usually end with run()
  },
  chain: jest.fn().mockReturnThis(), // Mock chain to return 'this' (the mockEditor.commands)
  isActive: jest.fn(() => false), // Default for isActive
  destroy: jest.fn(),
  isDestroyed: false,
  isEditable: true,
  on: jest.fn(),
  off: jest.fn(),
  setOptions: jest.fn(),
};


jest.mock('@tiptap/react', () => ({
  ...jest.requireActual('@tiptap/react'),
  useEditor: jest.fn(() => mockEditor),
  EditorContent: jest.fn(({ editor }) => <div data-testid="editor-content" dangerouslySetInnerHTML={{ __html: editor?.getHTML() }}></div>),
}));


const mockCreateNewsArticleMutation = trpc.newsArticles.createNewsArticle.useMutation as jest.Mock;
const mockMutateFn = jest.fn(); // Renamed from mockMutateAsync for clarity as it's part of the hook's return


// --- Test Suite ---
describe('PostEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEditor.getHTML.mockReturnValue('<p>Test editor content</p>');
    mockEditor.isEmpty = false; // Reset isEmpty

    // Setup default mock return for the mutation hook
    mockCreateNewsArticleMutation.mockReturnValue({
      mutate: mockMutateFn, // use 'mutate' as per tRPC v10+ standard
      isLoading: false,
      // onSuccess and onError are part of useMutation options, not typically returned directly unless structured so
    });
  });

  // Test DOMPurify Integration
  test('sanitizes editor HTML content using DOMPurify for preview', async () => {
    render(<PostEditor />);
    // Switch to preview tab
    const previewTabTrigger = screen.getByRole('tab', { name: /Prévisualiser/i });
    fireEvent.click(previewTabTrigger);

    // Wait for the preview content to render, which should trigger sanitize
    await waitFor(() => {
      expect(DOMPurify.sanitize).toHaveBeenCalledWith('<p>Test editor content</p>');
    });
  });

  // Tests for handleImageUpload
  describe('handleImageUpload', () => {
    // Helper to get the file input; assuming it's an invisible input triggered by a clickable div
    const getFileInputAndTriggerClick = (container: HTMLElement) => {
        const clickableDiv = container.querySelector('.border-2.border-dashed'); // More specific selector if possible
        if (!clickableDiv) throw new Error("Clickable div for file input not found");
        fireEvent.click(clickableDiv); // This should internally call fileInputRef.current.click()
        // The actual input is harder to get directly if .click() is on a ref.
        // Let's assume the input is findable by its 'type=file' attribute for change event.
        return screen.getByRole('textbox', { hidden: true }) as HTMLInputElement; // This is how Next.js renders file inputs
    };


    test('successfully processes a valid image file', async () => {
      render(<PostEditor />);
      // The input is hidden, so we target the clickable area then the input for the change event
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput) throw new Error("File input not found");

      const file = new File(['dummy_content'], 'test.png', { type: 'image/png', size: 1024 });

      // Simulate file selection
      await fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Image uploaded successfully!');
      });
      // Also check if the image is displayed (optional, but good)
      expect(screen.getByAltText('Featured')).toBeInTheDocument();
    });

    test('rejects invalid file type with a toast error', async () => {
      render(<PostEditor />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput) throw new Error("File input not found");
      const file = new File(['dummy_content'], 'test.txt', { type: 'text/plain', size: 1024 });

      await fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid file type. Please select a JPEG, PNG, GIF, or WEBP image.');
      });
      expect(fileInput.value).toBe('');
    });

    test('rejects file exceeding max size with a toast error', async () => {
      render(<PostEditor />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput) throw new Error("File input not found");

      const maxSize = 2 * 1024 * 1024;
      const file = new File(['dummy_content'], 'large.png', { type: 'image/png', size: maxSize + 1 });

      await fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('File is too large. Maximum size is 2MB.');
      });
      expect(fileInput.value).toBe('');
    });

    test('handles FileReader error with a toast', async () => {
        const mockReaderInstance = {
            readAsDataURL: jest.fn(),
            onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
            onerror: null as (() => void) | null,
            result: '',
        };
        jest.spyOn(window, 'FileReader').mockImplementation(() => mockReaderInstance as any);

        render(<PostEditor />);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (!fileInput) throw new Error("File input not found");
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });

        await fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);
        // Manually trigger onerror
        if(mockReaderInstance.onerror) {
            mockReaderInstance.onerror();
        }

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to read file. Please try again.');
        });
        expect(fileInput.value).toBe('');
    });
  });

  // Tests for Form Submission (handleSave / createNewsArticle)
  describe('Form Submission (handleSave)', () => {
    test('shows toast error if title is empty', async () => {
      render(<PostEditor />);
      const titleInput = screen.getByPlaceholderText("Titre de l'article") as HTMLInputElement;
      fireEvent.change(titleInput, {target: {value: '  '}}); // Empty or whitespace title

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Title is required.');
      });
      expect(mockMutateFn).not.toHaveBeenCalled();
    });

    // Test for editor not initialized is tricky if useEditor always returns a mock.
    // Assuming editor is always initialized by the mock.

    test('calls createNewsArticle mutation on successful validation', async () => {
      // Default mockCreateNewsArticleMutation setup in beforeEach already handles success case by default
      // We need to define what mockMutateFn resolves to for the onSuccess callback in the component
      // The component's onSuccess expects data with a 'title' property.
      mockMutateFn.mockImplementation((variables) => {
        const { onSuccess } = mockCreateNewsArticleMutation.mock.calls[0][0]; // Get options passed to useMutation
        onSuccess({ title: variables.title }); // Simulate successful call by invoking onSuccess
        return Promise.resolve({ title: variables.title });
      });

      render(<PostEditor />);

      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: 'My Awesome Article'}});

      const excerptInput = screen.getByPlaceholderText("Résumé de l'article");
      fireEvent.change(excerptInput, {target: {value: 'Awesome summary'}});

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockMutateFn).toHaveBeenCalledWith(expect.objectContaining({
          title: 'My Awesome Article',
          content: '<p>Test editor content</p>',
          summary: 'Awesome summary',
        }));
        // Check toast from component's onSuccess
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Article "My Awesome Article" created successfully!'));
      });
    });

    test('shows error toast if createNewsArticle mutation fails', async () => {
       mockMutateFn.mockImplementation((variables) => {
        const { onError } = mockCreateNewsArticleMutation.mock.calls[0][0]; // Get options
        onError(new Error('API Error')); // Simulate error by invoking onError
        return Promise.reject(new Error('API Error'));
      });
      render(<PostEditor />);

      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: 'Another Article'}});

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockMutateFn).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith('Failed to create article: API Error');
      });
    });

    test('submit button is disabled and shows loading text during mutation', async () => {
      mockCreateNewsArticleMutation.mockReturnValueOnce({
        mutate: mockMutateFn,
        isLoading: true, // Simulate loading state
      });
      render(<PostEditor />);

      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: 'Loading State Article'}});

      // Check button text and disabled state
      const saveButton = screen.getByRole('button', { name: /Enregistrement.../i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });
  });
});
