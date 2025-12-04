import React from 'react';

interface ActionModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isConfirmation?: boolean;
}

export default function ActionModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isConfirmation = true
}: ActionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>

                    <div className="flex justify-end space-x-3">
                        {isConfirmation && (
                            <button
                                onClick={onCancel}
                                className="py-2 px-4 rounded-lg font-semibold transition duration-300 bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            onClick={onConfirm}
                            className={`py-2 px-4 rounded-lg font-bold transition duration-300 ${
                                isConfirmation
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {isConfirmation ? 'Confirmar' : 'Entendido'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}