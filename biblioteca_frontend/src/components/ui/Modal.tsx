import React, { useState } from 'react';
import ActionModal from '../../components/feature/BookActionModal';

const mockBooks = [
    { id: 1, title: "O Senhor dos Anéis", author: "J.R.R. Tolkien" },
    { id: 2, title: "1984", author: "George Orwell" },
    { id: 3, title: "Pequeno Príncipe", author: "Antoine de Saint-Exupéry" },
];

interface ModalState {
    isOpen: boolean;
    bookId: number | null;
    bookTitle: string;
}

export default function BookListPage() {
    const [books, setBooks] = useState(mockBooks);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        bookId: null,
        bookTitle: ''
    });

    const openDeleteModal = (bookId: number, bookTitle: string) => {
        setModalState({
            isOpen: true,
            bookId,
            bookTitle
        });
    };

    const handleCancel = () => {
        setModalState({
            isOpen: false,
            bookId: null,
            bookTitle: ''
        });
    };

    const handleConfirmDelete = () => {
        if (modalState.bookId) {
            console.log(`Livro com ID ${modalState.bookId} (${modalState.bookTitle}) excluído!`);
        
            setBooks(prevBooks => prevBooks.filter(book => book.id !== modalState.bookId));
        }
        handleCancel();
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Minha Biblioteca</h1>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {books.map(book => (
                        <li key={book.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition duration-150">
                            <span className="text-lg font-medium text-gray-700">
                                {book.title} <span className="text-sm text-gray-500">por {book.author}</span>
                            </span>
                            <button
                                onClick={() => openDeleteModal(book.id, book.title)}
                                className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition duration-300"
                            >
                                Excluir
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <ActionModal
                isOpen={modalState.isOpen}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o livro "${modalState.bookTitle}"? Esta ação não pode ser desfeita.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancel}
                isConfirmation={true}
            />
        </div>
    );
}