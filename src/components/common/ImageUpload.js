import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  LinearProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  CloudUpload,
  Image,
  Delete,
} from '@mui/icons-material';

const ImageUpload = ({
  onImageUpload,
  multiple = false,
  maxSize = 5, // MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8,
}) => {
  const theme = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Validate file
  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`);
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }
    
    return true;
  };

  // Compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle file upload
  const handleFiles = useCallback(async (files) => {
    setError('');
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const fileArray = Array.from(files);
      const processedFiles = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Validate file
        validateFile(file);
        
        // Compress image
        const compressedFile = await compressImage(file);
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(compressedFile);
        
        processedFiles.push({
          file: compressedFile,
          preview: previewUrl,
          name: file.name,
          size: compressedFile.size,
        });
        
        // Update progress
        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }
      
      // Update state
      if (multiple) {
        setUploadedImages(prev => [...prev, ...processedFiles]);
      } else {
        setUploadedImages(processedFiles);
      }
      
      // Call callback
      if (onImageUpload) {
        const filesToUpload = multiple ? processedFiles : processedFiles[0];
        onImageUpload(filesToUpload);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, onImageUpload]);

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // File input handler
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    
    if (onImageUpload) {
      onImageUpload(multiple ? newImages : newImages[0] || null);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Upload Area */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          textAlign: 'center',
          border: dragActive ? `2px dashed ${theme.palette.primary.main}` : '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          backgroundColor: dragActive ? 'primary.light' : 'background.paper',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {dragActive ? 'Drop images here' : 'Upload Images'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Drag and drop images here, or click to select files
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supported formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} | 
          Max size: {maxSize}MB | 
          Max dimensions: {maxWidth}x{maxHeight}
        </Typography>
      </Paper>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              Uploading...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(uploadProgress)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Images ({uploadedImages.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {uploadedImages.map((image, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  position: 'relative',
                  width: 200,
                  height: 150,
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                <img
                  src={image.preview}
                  alt={image.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                
                {/* Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 1,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        display: 'block',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {image.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'white' }}>
                      {formatFileSize(image.size)}
                    </Typography>
                  </Box>
                </Box>

                {/* Remove Button */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.main',
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload; 