import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

const ImageUpload = ({ onChange, single = false, currentImage = null }) => {
  const [images, setImages] = useState([]);
  const [singleImage, setSingleImage] = useState(null);
  const [error, setError] = useState("");
  
  // Initialize single image if currentImage is provided
  useEffect(() => {
    if (single && currentImage) {
      setSingleImage({ url: currentImage, preview: currentImage });
    }
  }, [currentImage, single]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    setError("");

    if (single && files.length > 1) {
      setError("Only one image allowed.");
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPEG, PNG, and WEBP formats are supported.");
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB.");
        continue;
      }

      try {
        const compressedFile = await compressImage(file);
        validFiles.push({
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
        });
      } catch (err) {
        setError("Error compressing image.");
        continue;
      }
    }

    if (single) {
      // For single mode, replace current image
      if (validFiles.length > 0) {
        setSingleImage(validFiles[0]);
        onChange && onChange(validFiles[0].file);
      }
    } else {
      // For multiple mode, append to existing images
      const newImages = [...images, ...validFiles];
      setImages(newImages);
      onChange && onChange(newImages.map((img) => img.file));
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image(); // ✅ use browser's Image
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject(new Error("Compression failed"));
            }
          },
          file.type,
          0.9
        );
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    if (single) {
      setSingleImage(null);
      onChange && onChange(null);
    } else {
      const updated = images.filter((_, i) => i !== index);
      setImages(updated);
      onChange && onChange(updated.map((img) => img.file));
    }
  };

  const displayImages = single ? (singleImage ? [singleImage] : []) : images;

  return (
    <Box>
      {!single && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            border: "2px dashed",
            borderColor: "grey.400",
            borderRadius: 2,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h6">Upload Images</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Drag and drop images here, or click to select files
            <br />
            Supported formats: JPEG, PNG, WEBP | Max size: 5MB | Max dimensions:
            1920x1080
          </Typography>
          <Button variant="contained" component="label" startIcon={<ImageIcon />}>
            Select Files
            <input
              hidden
              accept="image/jpeg,image/png,image/webp"
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Button>
        </Paper>
      )}

      {single && (
        <Button 
          variant="outlined" 
          component="label" 
          startIcon={<ImageIcon />}
          sx={{ mb: 2 }}
        >
          {singleImage ? 'Change Image' : 'Upload Image'}
          <input
            hidden
            accept="image/jpeg,image/png,image/webp"
            type="file"
            onChange={handleFileChange}
          />
        </Button>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {displayImages.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {displayImages.map((img, index) => (
            <Grid item xs={single ? 12 : 6} sm={single ? 6 : 4} md={single ? 4 : 3} key={index}>
              <Paper
                sx={{
                  position: "relative",
                  p: 1,
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  maxWidth: single ? 200 : "100%",
                }}
              >
                <img
                  src={img.preview || img.url}
                  alt={single ? "Preview" : `preview-${index}`}
                  style={{ width: "100%", borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8, bgcolor: "white" }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ImageUpload;