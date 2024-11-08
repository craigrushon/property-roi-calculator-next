import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode
} from 'react';

// Define the types for the context values
interface ModalContextType {
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
}

// Create the context with a null default to allow type-checking in the hook
const ModalContext = createContext<ModalContextType | null>(null);

// Custom hook for consuming the modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
  }, []);

  const value: ModalContextType = {
    isModalOpen,
    showModal,
    hideModal,
    modalContent
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          {modalContent}
        </div>
      )}
    </ModalContext.Provider>
  );
};
