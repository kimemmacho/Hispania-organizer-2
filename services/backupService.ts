/**
 * This service centralizes the logic for creating a local backup of the user's data.
 * It also records the timestamp of the backup to enable the reminder feature.
 */

export const performBackupAndRecordTimestamp = () => {
    try {
        const backupData = {
            backupVersion: "2.0",
            backupDate: new Date().toISOString(),
            data: {
                // Core Data
                heroDatabase: JSON.parse(localStorage.getItem('hero-database') || '[]'),
                playerData: JSON.parse(localStorage.getItem('player-hero-data') || '{}'),
                settings: JSON.parse(localStorage.getItem('afk-settings') || '{}'),

                // Feature-specific Data
                furniturePriorities: JSON.parse(localStorage.getItem('furniture-priority-data') || '{}'),
                watchlist: JSON.parse(localStorage.getItem('watchlist-slots') || '[]'),
                customEngravingNodes: JSON.parse(localStorage.getItem('custom-engraving-nodes') || '{}'),
                ignoredTips: JSON.parse(localStorage.getItem('ignored-tips') || '{}'),

                // Caches & Metadata (good to have for UX)
                translationCache: JSON.parse(localStorage.getItem('comment-translations') || '{}'),
                lastSync: JSON.parse(localStorage.getItem('hero-db-last-sync') || 'null'),
            }
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_hispania_afk_data_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Record the timestamp of this successful backup.
        localStorage.setItem('last-manual-backup-date', JSON.stringify(new Date().toISOString()));

    } catch (error) {
        console.error("Backup failed:", error);
        // Rethrow the error so the caller can handle it (e.g., show an alert).
        throw error;
    }
};

export const restoreFromBackupFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                if (!content) {
                    throw new Error("El archivo está vacío o no se pudo leer.");
                }
                const restoredBackup = JSON.parse(content);

                // --- VALIDATION ---
                if (!restoredBackup.backupVersion || !restoredBackup.data) {
                    throw new Error("El archivo no parece ser una copia de seguridad válida.");
                }

                const dataToRestore = restoredBackup.data;

                // --- CLEAR & RESTORE ---
                localStorage.clear();
                sessionStorage.clear();

                // Restore all keys from the backup data object
                localStorage.setItem('hero-database', JSON.stringify(dataToRestore.heroDatabase || []));
                localStorage.setItem('player-hero-data', JSON.stringify(dataToRestore.playerData || {}));
                localStorage.setItem('afk-settings', JSON.stringify(dataToRestore.settings || {}));
                localStorage.setItem('furniture-priority-data', JSON.stringify(dataToRestore.furniturePriorities || {}));
                localStorage.setItem('watchlist-slots', JSON.stringify(dataToRestore.watchlist || []));
                localStorage.setItem('custom-engraving-nodes', JSON.stringify(dataToRestore.customEngravingNodes || {}));
                localStorage.setItem('ignored-tips', JSON.stringify(dataToRestore.ignoredTips || {}));
                localStorage.setItem('comment-translations', JSON.stringify(dataToRestore.translationCache || {}));
                localStorage.setItem('hero-db-last-sync', JSON.stringify(dataToRestore.lastSync || null));
                
                // FIX: After restoring, also set the backup date to prevent the modal from reappearing incorrectly.
                if (restoredBackup.backupDate) {
                    localStorage.setItem('last-manual-backup-date', JSON.stringify(restoredBackup.backupDate));
                }
                
                resolve();
            } catch (error) {
                console.error("Restore error:", error);
                reject(error instanceof Error ? error : new Error('Error al procesar el archivo JSON.'));
            }
        };
        reader.onerror = (error) => {
            console.error("File reading error:", error);
            reject(new Error("No se pudo leer el archivo."));
        };
        reader.readAsText(file);
    });
};