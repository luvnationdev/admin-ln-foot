// components/Posts/PostEditor.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostEditor from './PostEditor'; // Changed from {PostEditor} to default import
import { trpc } from '@/lib/trpc/react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
// useUploadFile is not directly used by the component's handleImageUpload for featured image,
// it uses FileReader directly. So, this mock might be for other potential image uploads or can be removed if not relevant.
// import { useUploadFile } from '@/lib/minio/upload';

// --- Mocks ---
jest.mock('@/lib/trpc/react', () => ({
  trpc: {
    newsArticles: { // Corrected based on component's usage
      createNewsArticle: {
        useMutation: jest.fn(),
      },
    },
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
  sanitize: jest.fn((html) => html),
}));

// Mock the Tiptap editor instance
const mockEditor = {
  getHTML: jest.fn(() => '<p>Test editor content</p>'),
  getText: jest.fn(() => 'Test editor content'),
  isEmpty: false,
  commands: {
    setContent: jest.fn().mockReturnThis(),
    focus: jest.fn().mockReturnThis(),
    clearContent: jest.fn().mockReturnThis(),
    toggleBold: jest.fn().mockReturnThis(),
    toggleItalic: jest.fn().mockReturnThis(),
    toggleBulletList: jest.fn().mockReturnThis(),
    toggleOrderedList: jest.fn().mockReturnThis(),
    setImage: jest.fn().mockReturnThis(),
    run: jest.fn().mockReturnThis(),
  },
  chain: jest.fn().mockReturnThis(),
  isActive: jest.fn(() => false),
  destroy: jest.fn(),
  isDestroyed: false,
  isEditable: true,
  on: jest.fn(),
  off: jest.fn(),
  setOptions: jest.fn(),
};

// Updated EditorContent mock
jest.mock('@tiptap/react', () => ({
  ...jest.requireActual('@tiptap/react'),
  useEditor: jest.fn(() => mockEditor),
  EditorContent: jest.fn(() => <div data-testid="mock-editor-content">Mocked Editor Content</div>), // Simplified mock
}));

// This mock might not be needed if useUploadFile is not used for the featured image.
// The component uses FileReader for the featured image preview.
// jest.mock('@/lib/minio/upload', () => ({
//   useUploadFile: jest.fn(),
// }));
// const mockUseUploadFile = useUploadFile as jest.Mock;
// const mockUploadFileFn = jest.fn();


const mockCreateNewsArticleMutation = trpc.newsArticles.createNewsArticle.useMutation as jest.Mock;
// Renamed from mockMutateAsync to mockMutateFn for clarity, matching component's useMutation return
const mockMutateFn = jest.fn();

// Define a more specific type for the FileReader mock
interface MockFileReader {
    readAsDataURL: jest.Mock<void, [File]>;
    onload: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null;
    onerror: ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null;
    result: string | ArrayBuffer | null;
}


// --- Test Suite ---
describe('PostEditor Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEditor.getHTML.mockReturnValue('<p>Test editor content</p>');
    mockEditor.getText.mockReturnValue('Test editor content');
    mockEditor.isEmpty = false;

    mockCreateNewsArticleMutation.mockReturnValue({
      // The hook returns 'mutate' or 'mutateAsync', and 'isLoading'.
      // 'onSuccess' and 'onError' are part of the options passed to useMutation.
      mutate: mockMutateFn,
      isLoading: false,
    });

    // If useUploadFile was used for featured image, this would be relevant.
    // mockUseUploadFile.mockReturnValue({
    //     uploadFile: mockUploadFileFn,
    //     isUploading: false,
    //     error: null,
    // });
    // mockUploadFileFn.mockResolvedValue('http://example.com/uploaded-image.jpg');
  });

  test('sanitizes editor HTML content using DOMPurify for preview', async () => {
    render(<PostEditor />);
    const previewTabTrigger = screen.getByRole('tab', { name: /Prévisualiser/i });
    fireEvent.click(previewTabTrigger);

    await waitFor(() => {
      // The preview div in PostEditor uses editor.getHTML()
      // So, DOMPurify.sanitize should be called with its result.
      expect(DOMPurify.sanitize).toHaveBeenCalledWith('<p>Test editor content</p>');
    });
  });

  describe('handleImageUpload', () => {
    // Helper to get the file input
    const getFileInput = () => document.querySelector('input[type="file"]') as HTMLInputElement;

    test('successfully processes a valid image file', async () => {
      render(<PostEditor />);
      const fileInput = getFileInput();
      if (!fileInput) throw new Error("File input not found");
      const file = new File(['dummy_content'], 'test.png', { type: 'image/png', size: 1024 });

      await fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Image uploaded successfully!');
      });
      // Check if the image is displayed (via its alt text)
      expect(screen.getByAltText('Featured')).toBeInTheDocument();
    });

    test('rejects invalid file type with a toast error', async () => {
      render(<PostEditor />);
      const fileInput = getFileInput();
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
      const fileInput = getFileInput();
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
        const mockReaderInstance: MockFileReader = {
            readAsDataURL: jest.fn(),
            onload: null,
            onerror: null,
            result: '',
        };
        const fileReaderSpy = jest.spyOn(window, 'FileReader').mockImplementation(() => mockReaderInstance as unknown as FileReader);

        render(<PostEditor />);
        const fileInput = getFileInput();
        if (!fileInput) throw new Error("File input not found");
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });

        await fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockReaderInstance.readAsDataURL).toHaveBeenCalledWith(file);

        if(mockReaderInstance.onerror) {
            mockReaderInstance.onerror.call(mockReaderInstance as unknown as FileReader, new ProgressEvent('error'));
        }

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to read file. Please try again.');
        });
        expect(fileInput.value).toBe('');
        fileReaderSpy.mockRestore();
    });
  });

  describe('Form Submission (handleSave)', () => {
    test('shows toast error if title is empty', async () => {
      render(<PostEditor />);
      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: '  '}}); // Empty or whitespace

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Title is required.');
      });
      expect(mockMutateFn).not.toHaveBeenCalled();
    });

    // Test for empty editor content (if component adds this validation)
    // The current component code does not explicitly validate for empty editor content client-side before mutation.
    // It sends editor.getHTML() which could be empty (e.g., "<p></p>" or "").
    // If such validation were added, a test like this would be relevant:
    /*
    test('shows toast error if editor content is empty', async () => {
      mockEditor.getHTML.mockReturnValueOnce(''); // Or "<p></p>" depending on "empty"
      // mockEditor.isEmpty = true; // If using editor.isEmpty for validation
      render(<PostEditor />);

      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: 'Valid Title'}});

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Content cannot be empty.'); // Or similar message
      });
      expect(mockMutateFn).not.toHaveBeenCalled();
    });
    */

    test('calls createNewsArticle mutation on successful validation', async () => {
      // This test needs to simulate how onSuccess is called from the component
      // The component defines onSuccess inside useMutation options.
      // So, we get the options from the mock, then call its onSuccess.
      mockCreateNewsArticleMutation.mockImplementationOnce((options: any) => {
        return {
          mutate: mockMutateFn.mockImplementationOnce((variables) => {
            // Simulate successful API call and then trigger component's onSuccess
            if (options.onSuccess) {
              options.onSuccess({ title: variables.title }); // Pass data expected by onSuccess
            }
          }),
          isLoading: false,
        };
      });

      render(<PostEditor />);

      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: 'My Awesome Article'}});

      const excerptInput = screen.getByPlaceholderText("Résumé de l'article");
      fireEvent.change(excerptInput, {target: {value: 'Awesome summary'}});

      // Assuming featuredImage state would be set by handleImageUpload in a real scenario
      // For this test, it will be an empty string if not uploaded.

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockMutateFn).toHaveBeenCalledWith(expect.objectContaining({
          title: 'My Awesome Article',
          content: '<p>Test editor content</p>',
          summary: 'Awesome summary',
          imageUrl: '', // As featuredImage state is initially ""
        }));
        expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Article "My Awesome Article" created successfully!'));
      });
    });

    test('shows error toast if createNewsArticle mutation fails', async () => {
      mockCreateNewsArticleMutation.mockImplementationOnce((options: any) => {
        return {
          mutate: mockMutateFn.mockImplementationOnce(() => {
            // Simulate failed API call and then trigger component's onError
            if (options.onError) {
              options.onError(new Error('API Error'));
            }
          }),
          isLoading: false,
        };
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
        mutate: mockMutateFn, // or jest.fn() if not testing its call
        isLoading: true,
      });
      render(<PostEditor />);

      // Title input needs to be valid for the save button to be enabled before isLoading state
      const titleInput = screen.getByPlaceholderText("Titre de l'article");
      fireEvent.change(titleInput, {target: {value: 'Loading State Article'}});

      const saveButton = screen.getByRole('button', { name: /Enregistrement.../i });
      expect(saveButton).toBeDisabled();
    });
  });
});
