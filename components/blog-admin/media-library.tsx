'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Media } from '@/types/blog';
import { uploadMedia, deleteMedia, getAllMedia } from '@/lib/blog/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface MediaLibraryProps {
  initialMedia?: Media[];
  onSelect?: (url: string) => void;
  selectable?: boolean;
}

export function MediaLibrary({ 
  initialMedia = [], 
  onSelect, 
  selectable = false 
}: MediaLibraryProps) {
  const router = useRouter();
  const [media, setMedia] = useState<Media[]>(initialMedia);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch media if not provided
  useEffect(() => {
    if (initialMedia.length === 0) {
      fetchMedia();
    }
  }, [initialMedia]);
  
  // Fetch all media
  const fetchMedia = async () => {
    try {
      const data = await getAllMedia();
      setMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };
  
  // Handle file selection for upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };
  
  // Trigger file input click
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  // Handle media upload
  const handleUpload = async (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Seules les images sont acceptées');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille maximale est de 5MB');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 10;
          return newProgress >= 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Upload file
      const result = await uploadMedia(formData);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (result.success) {
        // Add new media to the list
        setMedia(prev => [result.media, ...prev]);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        alert(`Erreur lors de l'upload: ${result.error}`);
      }
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Une erreur est survenue lors de l\'upload');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };
  
  // Handle media deletion
  const handleDelete = async (mediaId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      return;
    }
    
    setIsDeleting(mediaId);
    
    try {
      const result = await deleteMedia(mediaId);
      
      if (result.success) {
        // Remove from media list
        setMedia(prev => prev.filter(item => item.id !== mediaId));
      } else {
        alert(`Erreur lors de la suppression: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      alert('Une erreur est survenue lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Handle media selection
  const handleSelect = (url: string) => {
    if (onSelect && selectable) {
      onSelect(url);
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bibliothèque de médias ({media.length})</CardTitle>
        <button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isUploading ? 'En cours d\'upload...' : 'Ajouter un média'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*"
        />
      </CardHeader>
      <CardContent>
        {/* Upload progress */}
        {isUploading && (
          <div className="mb-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {uploadProgress}% Uploading...
            </p>
          </div>
        )}
        
        {/* Media grid */}
        {media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun média disponible</p>
            <p className="text-sm text-muted-foreground mt-2">
              Cliquez sur "Ajouter un média" pour commencer
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map(item => (
              <div
                key={item.id}
                className={`relative group border rounded-md overflow-hidden ${
                  selectable ? 'cursor-pointer' : ''
                }`}
                onClick={selectable ? () => handleSelect(item.url) : undefined}
              >
                <div className="aspect-square relative">
                  {item.file_type.startsWith('image/') ? (
                    <Image
                      src={item.url}
                      alt={item.file_name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-muted-foreground">
                        {item.file_type.split('/')[1]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {selectable ? (
                    <button className="text-white border border-white px-3 py-1 rounded-md text-sm hover:bg-white/20">
                      Sélectionner
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      disabled={isDeleting === item.id}
                      className="text-white border border-white px-3 py-1 rounded-md text-sm hover:bg-white/20"
                    >
                      {isDeleting === item.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  )}
                </div>
                
                {/* Media info (shown on hover) */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                  <p className="truncate">{item.file_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
