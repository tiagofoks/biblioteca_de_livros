import { Book } from '@/types/Book';

interface BookDetailsViewProps {
  book: Book;
}

export default function BookDetailsView({ book }: BookDetailsViewProps) {
  return (
    <>
      <h1 className="text-4xl font-extrabold mb-4">{book.title}</h1>
      <p className="text-xl text-gray-700 mb-6">Por: {book.author}</p>
      
      <div className="space-y-3 text-lg">
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Ano de Publicação:</strong> {book.publication_year}</p>
        <p><strong>Descrição:</strong></p>
        <div className="p-4 border rounded-md bg-gray-50 whitespace-pre-wrap">
          {book.description || 'Nenhuma descrição fornecida.'}
        </div>
      </div>
    </>
  );
}
