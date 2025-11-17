import React from 'react';
import { ExclamationTriangleIcon } from './icons';
import { restoreFromBackupFile } from '../services/backupService';

interface BackupReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    lastBackupDate: string | null;
}

const BackupReminderModal: React.FC<BackupReminderModalProps> = ({ isOpen, onClose, onConfirm, lastBackupDate }) => {
    if (!isOpen) {
        return null;
    }

    const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await restoreFromBackupFile(file);
                alert('Copia de seguridad restaurada con éxito. La página se recargará para aplicar los cambios.');
                window.location.reload();
            } catch (error) {
                console.error("Restore error:", error);
                alert(`Error al restaurar: ${error instanceof Error ? error.message : 'Error desconocido.'}`);
            } finally {
                if (event.target) event.target.value = '';
            }
        }
    };

    const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ease-out animate-[fade-in_0.3s_ease-out]"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/80 text-left overflow-hidden transform transition-all duration-300 ease-out w-full max-w-md mx-4 animate-[slide-up_0.4s_ease-out]"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
            <style>
                {`
                    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slide-up { from { transform: translateY(2rem) scale(0.95); opacity: 0; } to { opacity: 1; } }
                `}
            </style>
        </div>
    );

    if (!lastBackupDate) {
        // First visit version
        return (
            <ModalWrapper>
                <div className="p-6">
                    <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-sky-800 to-blue-800 sm:mx-0 sm:h-10 sm:w-10">
                           <i className="fas fa-database text-sky-300 text-lg"></i>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-xl leading-6 font-bold text-white" id="modal-title">
                                ¡Bienvenido!
                            </h3>
                            <div className="mt-2 text-sm text-gray-300 space-y-2">
                                <p>No se han encontrado datos guardados en este dispositivo.</p>
                                <p>Si tienes una copia de seguridad, puedes restaurarla ahora. Si no, puedes empezar desde cero.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/50 px-6 py-4 sm:flex sm:flex-row-reverse">
                    <label className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-blue-600 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] cursor-pointer">
                        Cargar copia de seguridad
                        <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                    </label>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-600 shadow-sm px-5 py-2.5 bg-gray-700 text-base font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                        onClick={onClose}
                    >
                        Empezar de cero
                    </button>
                </div>
            </ModalWrapper>
        );
    }

    // Reminder version
    return (
        <ModalWrapper>
            <div className="p-6">
                <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-sky-800 to-blue-800 sm:mx-0 sm:h-10 sm:w-10">
                       <ExclamationTriangleIcon className="h-6 w-6 text-sky-300" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-xl leading-6 font-bold text-white" id="modal-title">
                            Recordatorio de Copia de Seguridad
                        </h3>
                        <div className="mt-2 text-sm text-gray-300 space-y-2">
                            <p>Ha pasado más de un mes desde tu última copia de seguridad local.</p>
                            <p>Te recomendamos crear una copia para proteger tu progreso y configuraciones.</p>
                            <p className="text-xs text-gray-500 mt-4">
                                Tu última copia fue guardada el: {new Date(lastBackupDate).toLocaleString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-900/50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-blue-600 text-base font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                    onClick={onConfirm}
                >
                    Crear copia ahora
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-600 shadow-sm px-5 py-2.5 bg-gray-700 text-base font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                    onClick={onClose}
                >
                    Recordármelo más tarde
                </button>
            </div>
        </ModalWrapper>
    );
};

export default BackupReminderModal;
