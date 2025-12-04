'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../../../lib/api'; 
import { Book } from '../../../types/Book';
import BookDetailsView from '../../../components/BookDetailsView';
import BookEditForm from '../../../components/BookEditForm';
import { useRouter } from 'next/navigation';

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = params;
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getBookById(id);
      setBook(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar detalhes do livro:", err);
      setError('Livro não encontrado ou erro na API.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleDelete = async () => {
    const isConfirmed = window.confirm(`Tem certeza que deseja EXCLUIR LOGICAMENTE o livro: ${book?.title}?`);

    if (isConfirmed) {
      try {
        await apiService.softDeleteBook(id);
        window.alert('Livro excluído com sucesso!');
        router.push('/');
      } catch (err) {
        console.error("Erro ao excluir o livro:", err);
        setError('Erro ao excluir o livro.');
      }
    }
  };
  
  if (loading) return <div className="p-8 text-center">Carregando detalhes do livro...</div>;
  if (error || !book) return <div className="p-8 text-red-600 text-center">{error || 'Livro não encontrado.'}</div>;

  return (
    <div className="container mx-auto p-8">
      <button onClick={() => router.push('/')} className="mb-6 text-blue-600 hover:underline">
        &larr; Voltar para a Consulta
      </button>

      <div className="bg-white shadow-lg rounded-xl p-8">
        
        {/* Renderiza o formulário de edição ou a visualização */}
        {isEditing ? (
          <BookEditForm 
            initialData={book}
            onSuccess={() => {
              setIsEditing(false);
              fetchBookDetails();
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <BookDetailsView book={book} />
        )}
        
        {/* Botões de Ação */}
        <div className="mt-8 flex justify-end space-x-4">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {isEditing ? 'Cancelar Edição' : 'Editar Livro'}
          </button>
          
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Excluir Livro
          </button>
        </div>
      </div>
    </div>
  );
}