"use client";

import {useState, useRef, useCallback, useEffect, ChangeEvent, DragEvent} from 'react';
import {
    Upload,
    File,
    Image as ImageIcon,
    FileVideo,
    FileAudio,
    Archive,
    FileText,
    X,
    AlertCircle,
    Loader2,
    ExternalLink,
    Maximize2
} from 'lucide-react';

type FileType = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';

interface ApiResponse {
    fileId: string;
    signedUrl: string;
}

interface UploadedFile {
    id: string;
    name: string;
    type: FileType;
    signedUrl: string;
    localPreviewUrl?: string;
    uploadedAt: Date;
}

const FileUploader = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [previewModalFile, setPreviewModalFile] = useState<UploadedFile | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            uploadedFiles.forEach(file => {
                if (file.localPreviewUrl) {
                    URL.revokeObjectURL(file.localPreviewUrl);
                }
            });
            if (selectedFilePreview) {
                URL.revokeObjectURL(selectedFilePreview);
            }
        };
    }, [uploadedFiles, selectedFilePreview]);

    useEffect(() => {
        if (selectedFile && isImageFile(selectedFile.type)) {
            const previewUrl = URL.createObjectURL(selectedFile);
            setSelectedFilePreview(previewUrl);
        } else {
            setSelectedFilePreview(null);
        }
    }, [selectedFile]);

    const isImageFile = (mimeType: string): boolean => {
        return mimeType.startsWith('image/');
    };

    const determineFileType = (mimeType: string): FileType => {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (
            mimeType.includes('pdf') ||
            mimeType.includes('document') ||
            mimeType.includes('msword') ||
            mimeType.includes('text/')
        ) return 'document';
        if (
            mimeType.includes('zip') ||
            mimeType.includes('rar') ||
            mimeType.includes('tar') ||
            mimeType.includes('7z')
        ) return 'archive';
        return 'other';
    };

    const getFileIcon = (fileType: FileType) => {
        switch (fileType) {
            case 'image':
                return <ImageIcon className="w-8 h-8 text-blue-500"/>;
            case 'document':
                return <FileText className="w-8 h-8 text-green-500"/>;
            case 'video':
                return <FileVideo className="w-8 h-8 text-red-500"/>;
            case 'audio':
                return <FileAudio className="w-8 h-8 text-purple-500"/>;
            case 'archive':
                return <Archive className="w-8 h-8 text-amber-500"/>;
            default:
                return <File className="w-8 h-8 text-gray-500"/>;
        }
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        setErrorMessage(null);
        setSelectedFile(file);
    };

    const handleAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const clearSelectedFile = () => {
        if (selectedFilePreview) {
            URL.revokeObjectURL(selectedFilePreview);
            setSelectedFilePreview(null);
        }
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const uploadFile = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);
        setErrorMessage(null);

        const fileType = determineFileType(selectedFile.type);

        try {
            // 1. Отримуємо підписаний URL для завантаження файлу
            const response = await fetch('http://localhost:3000/dev/uploads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: selectedFile.name,
                    fileType: fileType
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as ApiResponse;
            const {fileId, signedUrl} = data;

            console.log('selectedFile: ', selectedFile)
            // 2. Завантажуємо файл в S3 за допомогою підписаного URL
            const uploadResponse = await fetch(signedUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': selectedFile.type
                },
                body: selectedFile
            });

            if (!uploadResponse.ok) {
                throw new Error(`Upload failed: ${uploadResponse.status}`);
            }

            // Збільшуємо прогрес-бар після успішного завантаження
            setUploadProgress(80);

            // 3. Створюємо локальний URL для попереднього перегляду зображень
            let localPreviewUrl: string | undefined = undefined;

            if (isImageFile(selectedFile.type)) {
                localPreviewUrl = URL.createObjectURL(selectedFile);
            }

            // 4. Додаємо файл до списку завантажених
            setUploadedFiles(prev => [
                {
                    id: fileId,
                    name: selectedFile.name,
                    type: fileType,
                    signedUrl,
                    localPreviewUrl,
                    uploadedAt: new Date()
                },
                ...prev
            ]);

            clearSelectedFile();
        } catch (error) {
            console.error('Помилка завантаження файлу:', error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Виникла помилка при завантаженні файлу'
            );
        } finally {
            setIsUploading(false);
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const removeFile = useCallback(async (fileId: string) => {
        setUploadedFiles(prev => {
            const fileToRemove = prev.find(file => file.id === fileId);

            if (fileToRemove?.localPreviewUrl) {
                URL.revokeObjectURL(fileToRemove.localPreviewUrl);
            }

            return prev.filter(file => file.id !== fileId);
        });
    }, []);

    const openPreviewModal = (file: UploadedFile) => {
        setPreviewModalFile(file);
    };

    const closePreviewModal = () => {
        setPreviewModalFile(null);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Завантаження файлів</h1>

            <div
                className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200 mb-8
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${selectedFile ? 'bg-gray-50' : ''}
        `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleAreaClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileInputChange}
                />

                {!selectedFile ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Upload className="w-12 h-12 text-gray-400"/>
                        <div className="text-gray-600">
                            <p className="font-medium">Перетягніть файл сюди, або натисніть для вибору</p>
                            <p className="text-sm mt-2">Підтримуються зображення, документи, відео, аудіо та архіви</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between w-full mb-4">
                            <div className="flex items-center space-x-4">
                                {getFileIcon(determineFileType(selectedFile.type))}
                                <div className="text-left">
                                    <h3 className="font-medium">{selectedFile.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} МБ
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                                    onClick={clearSelectedFile}
                                >
                                    <X className="w-5 h-5 text-gray-500"/>
                                </button>
                            </div>
                        </div>

                        {selectedFilePreview && (
                            <div className="mt-4 max-w-xs mx-auto">
                                <img
                                    src={selectedFilePreview}
                                    alt="Попередній перегляд"
                                    className="max-h-48 max-w-full object-contain rounded border"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedFile && (
                <div className="mb-8">
                    {isUploading || uploadProgress > 0 ? (
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-in-out"
                                style={{width: `${uploadProgress}%`}}
                            />
                        </div>
                    ) : null}

                    <div className="flex justify-between items-center">
                        <button
                            className={`
                flex items-center space-x-2 px-6 py-2 rounded-md font-medium 
                ${isUploading
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }
              `}
                            onClick={uploadFile}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin"/>
                                    <span>Завантаження...</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5"/>
                                    <span>Завантажити</span>
                                </>
                            )}
                        </button>

                        {errorMessage && (
                            <div className="flex items-center text-red-500">
                                <AlertCircle className="w-5 h-5 mr-2"/>
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Завантажені файли</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        {getFileIcon(file.type)}
                                        <div>
                                            <h3 className="font-medium truncate max-w-[200px]">{file.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {new Date(file.uploadedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-1">
                                        <a
                                            href={file.signedUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
                                            title="Відкрити в новій вкладці"
                                        >
                                            <ExternalLink className="w-4 h-4"/>
                                        </a>

                                        {file.type === 'image' && file.localPreviewUrl && (
                                            <button
                                                className="p-1.5 rounded-full text-blue-500 hover:bg-blue-100 transition-colors"
                                                onClick={() => openPreviewModal(file)}
                                                title="Переглянути зображення"
                                            >
                                                <Maximize2 className="w-4 h-4"/>
                                            </button>
                                        )}

                                        <button
                                            className="p-1.5 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                                            onClick={() => removeFile(file.id)}
                                            title="Видалити файл"
                                        >
                                            <X className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>

                                {file.type === 'image' && file.localPreviewUrl && (
                                    <div
                                        className="mt-2 cursor-pointer"
                                        onClick={() => openPreviewModal(file)}
                                    >
                                        <img
                                            src={file.localPreviewUrl}
                                            alt={file.name}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {previewModalFile && previewModalFile.localPreviewUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={closePreviewModal}
                >
                    <div
                        className="max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 flex justify-between items-center border-b">
                            <h3 className="font-medium truncate max-w-md">{previewModalFile.name}</h3>
                            <button
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                onClick={closePreviewModal}
                            >
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-center bg-gray-100 overflow-auto">
                            <img
                                src={previewModalFile.localPreviewUrl}
                                alt={previewModalFile.name}
                                className="max-w-full max-h-[70vh] object-contain"
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <a
                                href={previewModalFile.signedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                <ExternalLink className="w-4 h-4"/>
                                <span>Відкрити оригінал</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;