'use client';

import React, { useState } from 'react';
import { apiService } from '../lib/api';
import { BookApiDto } from '../types/Book'; 

interface FormState {
    title: string;
    author: string;
    description: string;
    isbn: string;
    publicationDate: string; 
}

interface BookFormProps {
    onSuccess: () => void; 
}

export default function BookForm({ onSuccess }: BookFormProps) {   
    
    const [formData, setFormData] = useState<FormState>({
        title: '',
        author: '',
        description: '',
        isbn: '',
        publicationDate: String(new Date().getFullYear()), 
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
            setError('Por favor, preencha Título, Autor, ISBN e Ano.');
            setLoading(false);
            return;
        }

        try {
            
            const dataToSend: BookApiDto = {
                title: formData.title,
                author: formData.author,
                description: formData.description,
                isbn: formData.isbn,
                publication_year: parseInt(formData.publicationDate, 10), 
            }            

            await apiService.createBook(dataToSend);
            
            window.alert('Livro cadastrado com sucesso!'); 

            setFormData({
                title: '',
                author: '',
                description: '',
                isbn: '',
                publicationDate: String(new Date().getFullYear()),
            });
            onSuccess(); 

        } catch (err) {
            setError('Erro ao cadastrar o livro. Verifique os dados (como ISBN duplicado) e a API.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-green-700">Cadastrar Novo Livro</h2>
            
            {error && <p className="text-red-600 bg-red-100 p-3 rounded mb-4 font-medium">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                
                {/* Autor */}
                <input
                    type="text"
                    name="author"
                    placeholder="Autor"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                
                {/* ISBN */}
                <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                
                {/* Ano de Publicação */}
                <input
                    type="number"
                    name="publicationDate"
                    placeholder="Ano de Publicação"
                    value={formData.publicationDate}
                    onChange={handleChange}
                    required
                    min="1000"
                    max={new Date().getFullYear()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                
                {/* Descrição */}
                <textarea
                    name="description"
                    placeholder="Descrição (Opcional)"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg font-bold transition duration-300 ${
                        loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                    }`}
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar Livro'}
                </button>
            </form>
        </div>
    );
}
