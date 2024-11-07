'use client';
import { useState, FormEvent, useCallback, useEffect, useRef } from 'react';

interface User {
  id: number;
  name: string | null;
}

interface PostFormProps {
  onSubmit: (formData: FormData) => Promise<{ post?: any; error?: string }>;
  user: User | null;
}

export function PostForm({ onSubmit, user }: PostFormProps) {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
  }, []);

  useEffect(() => {
    if (!isSubmitting) return;

    async function submitData() {
      try {
        if (!formRef.current) return;

        const response = await onSubmit(new FormData(formRef.current));

        if (response?.error) {
          setErrors([response.error]);
        } else if (response?.post) {
          setSuccessMessage('Post created successfully!');
          setContent('');
        }
      } catch (error) {
        setErrors(['Something went wrong. Please try again.']);
      } finally {
        setIsSubmitting(false); // Reset isSubmitting and log to confirm
      }
    }

    submitData();
  }, [isSubmitting]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 bg-white shadow-md rounded-lg space-y-4"
      ref={formRef}
    >
      {user?.id && (
        <input type="hidden" name="authorId" value={user.id} hidden />
      )}
      <div>
        <label htmlFor="content" className="sr-only">
          Post Content
        </label>
        <textarea
          name="content"
          id="content"
          aria-describedby={errors.length > 0 ? 'error-message' : undefined}
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
          placeholder="What's on your mind today?"
        ></textarea>
      </div>

      {errors.length > 0 && (
        <div
          id="error-message"
          className="bg-red-100 text-red-700 p-4 rounded-md"
        >
          <ul>
            {errors.map((error, index) => (
              <li key={index} role="alert">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="bg-green-100 text-green-700 p-4 rounded-md"
        >
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          disabled={isSubmitting}
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          {isSubmitting ? 'Submitting...' : 'Post it!'}
        </button>
        <h4 className="text-sm text-gray-500">
          Currently posting as{' '}
          <span className="font-bold">{user?.name || 'Anonymous'}</span>
        </h4>
      </div>
    </form>
  );
}
