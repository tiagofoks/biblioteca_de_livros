'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '@/lib/api';
import { Book } from '@/types/Book';
import BookForm from './BookForm'; 
import Link from 'next/link'; 

export default function BookList() {

    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const fetchBooks = useCallback(async (search = searchTerm) => {
        try {
            setLoading(true);
        
            const data = await apiService.getBooks(search); 
            setBooks(data);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar a lista de livros da API.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
    
        const handler = setTimeout(() => {
            fetchBooks(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, fetchBooks]);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Tem certeza que deseja apagar logicamente o livro "${title}"?`)) {
            return;
        }

        try {
            await apiService.softDeleteBook(id);
            alert(`Livro "${title}" excluído com sucesso!`);
            fetchBooks();
        } catch (error) {
            console.error(error);
            alert('Erro ao realizar a exclusão lógica do livro.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Coluna do Formulário (Página de Consulta - Cadastro) */}
                <div className="md:col-span-1">
                    {/* O onSuccess recarrega a lista após o cadastro */}
                    <BookForm onSuccess={() => fetchBooks(searchTerm)} /> 
                </div>

                {/* Coluna da Lista de Livros (Página de Consulta - Listagem) */}
                <div className="md:col-span-2">
                    <h1 className="text-3xl font-bold mb-6">Consulta de Livros ({books.length})</h1>
                    
                    {/* 🔍 Input de Busca */}
                    <input
                        type="text"
                        placeholder="Buscar por Título, Autor ou ISBN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-blue-500 focus:border-blue-500"
                    />

                    {loading && <p className="text-center py-8">A carregar livros...</p>}
                    {error && <p className="text-red-600 text-center py-8">Erro: {error}</p>}

                    {!(loading || error) && (books.length === 0 ? (
                        <p>Nenhum livro encontrado. Tente adicionar um novo.</p>
                    ) : (
                        <ul className="space-y-4">
                        {books.map((book) => (
                            <li key={book.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-lg">{book.title}</p>
                                    <p className="text-gray-600">Autor: {book.author}</p>
                                    <p className="text-gray-500 text-sm">ISBN: {book.isbn} | Publicação: {book.publication_year}</p> 
                                </div>
                                <div className="space-x-2">
                                    {/* Link de Navegação para a Página de Detalhes */}
                                    <Link 
                                        href={`/books/${book.id}`} 
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Ver Detalhes
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(book.id, book.title)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                                    >
                                        Apagar
                                    </button>
                                </div>
                            </li>
                        ))}
                        </ul>
                    ))}
                </div>

            </div>
        </div>
    );
}