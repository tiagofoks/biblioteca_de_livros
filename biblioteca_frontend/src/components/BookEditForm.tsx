'use client';

import React, { useState } from 'react';
import { apiService } from '../lib/api';
import { Book, BookApiDto } from '../types/Book';

interface FormState {
    title: string;
    author: string;
    description: string;
    isbn: string;
    publicationDate: string;
}

interface BookEditFormProps {
    initialData: Book;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function BookEditForm({ initialData, onSuccess, onCancel }: BookEditFormProps) { 

    const [formData, setFormData] = useState<FormState>({
        title: initialData.title,
        author: initialData.author,
        description: initialData.description || '',
        isbn: initialData.isbn,
        publicationDate: String(initialData.publication_year), 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
       
        if (!formData.title || !formData.author || !formData.isbn || !formData.publicationDate) {
            setError('Por favor, preencha todos os campos obrigatórios (Título, Autor, ISBN e Ano).');
            setLoading(false);
            return;
        }

        try {           
            const dataToSend: Partial<BookApiDto> = {
                title: formData.title,
                author: formData.author,
                description: formData.description,
                isbn: formData.isbn,
                publication_year: parseInt(formData.publicationDate, 10), 
            }

            await apiService.updateBook(initialData.id, dataToSend);

            window.alert('Livro atualizado com sucesso!');
            onSuccess();

        } catch (err) {
            setError('Erro ao atualizar o livro. Verifique os dados e a conexão com a API.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-6 border rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Editar Livro: {initialData.title}</h2>
            
            {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 font-medium">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Título:</span>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>
                
                {/* Autor */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Autor:</span>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                {/* ISBN */}
                <label className="block">
                    <span className="text-gray-700 font-medium">ISBN:</span>
                    <input
                        type="text"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                {/* Ano de Publicação */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Ano de Publicação:</span>
                    <input
                        type="number"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleChange}
                        required
                        min="1000"
                        max={new Date().getFullYear()}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                {/* Descrição */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Descrição (Opcional):</span>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>

                {/* Botões de Ação */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="py-2 px-4 rounded-lg font-bold transition duration-300 bg-gray-300 hover:bg-gray-400 text-gray-800"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`py-2 px-4 rounded-lg font-bold transition duration-300 ${
                            loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}