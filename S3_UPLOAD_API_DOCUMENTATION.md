# S3 Upload API Documentation

## Overview

The Cleyverse S3 Upload API provides secure file upload functionality for the frontend. It supports both direct server-side uploads and presigned URL uploads for better performance and scalability.

## Base URL

```
Production: https://api.cleyfi.com/upload
Staging: https://api-staging.cleyfi.com/upload
```

## Authentication

All endpoints require JWT authentication:

```
Authorization: Bearer <your-jwt-token>
```

## Supported File Types

- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, TXT, DOC, DOCX, XLS, XLSX
- **Videos**: MP4, AVI, MOV
- **Audio**: MP3, WAV
- **Archives**: ZIP, RAR

## File Size Limits

- **Maximum file size**: 10MB per file
- **Recommended**: Keep files under 5MB for better performance

## API Endpoints

### 1. Direct File Upload

Upload a file directly to the server, which then uploads to S3.

**Endpoint:** `POST /upload/file`

**Content-Type:** `multipart/form-data`

**Form Data:**
```javascript
const formData = new FormData();
formData.append('file', fileObject); // The actual file
formData.append('folder', 'uploads'); // Optional: folder name (default: 'uploads')
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "key": "uploads/my-file-abc123.jpg",
    "url": "https://cleyverse-digital-files-staging-xyz.s3.us-east-1.amazonaws.com/uploads/my-file-abc123.jpg",
    "originalName": "my-file.jpg",
    "size": 1024000,
    "contentType": "image/jpeg"
  }
}
```

**Example (JavaScript):**
```javascript
const uploadFile = async (file, folder = 'uploads') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const response = await fetch('https://api-staging.cleyfi.com/upload/file', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
};
```

### 2. Generate Presigned Upload URL

Generate a presigned URL for direct frontend-to-S3 upload (recommended for larger files).

**Endpoint:** `POST /upload/presigned-url`

**Request Body:**
```json
{
  "fileName": "my-document.pdf",
  "contentType": "application/pdf",
  "folder": "documents",
  "maxFileSize": 10485760
}
```

**Response:**
```json
{
  "message": "Presigned URL generated successfully",
  "uploadUrl": "https://cleyverse-digital-files-staging-xyz.s3.us-east-1.amazonaws.com/uploads/my-document-abc123.pdf?X-Amz-Algorithm=...",
  "key": "uploads/my-document-abc123.pdf",
  "fields": {
    "Content-Type": "application/pdf",
    "x-amz-content-sha256": "UNSIGNED-PAYLOAD"
  },
  "expiresIn": 3600
}
```

**Example (JavaScript):**
```javascript
const generatePresignedUrl = async (fileName, contentType, folder = 'uploads') => {
  const response = await fetch('https://api-staging.cleyfi.com/upload/presigned-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName,
      contentType,
      folder,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    }),
  });

  return await response.json();
};

// Upload file using presigned URL
const uploadWithPresignedUrl = async (file, presignedData) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add any additional fields from presignedData.fields
  Object.entries(presignedData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(presignedData.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  return response.ok;
};
```

### 3. Get Signed Download URL

Get a temporary signed URL to download a file.

**Endpoint:** `GET /upload/download/:key`

**Query Parameters:**
- `expiresIn` (optional): URL expiration time in seconds (default: 3600)

**Response:**
```json
{
  "message": "Signed download URL generated successfully",
  "downloadUrl": "https://cleyverse-digital-files-staging-xyz.s3.us-east-1.amazonaws.com/uploads/my-file-abc123.jpg?X-Amz-Signature=...",
  "expiresIn": 3600
}
```

**Example (JavaScript):**
```javascript
const getDownloadUrl = async (fileKey, expiresIn = 3600) => {
  const response = await fetch(`https://api-staging.cleyfi.com/upload/download/${encodeURIComponent(fileKey)}?expiresIn=${expiresIn}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

### 4. Delete File

Delete a file from S3.

**Endpoint:** `DELETE /upload/file/:key`

**Response:**
```json
{
  "message": "File deleted successfully",
  "key": "uploads/my-file-abc123.jpg"
}
```

**Example (JavaScript):**
```javascript
const deleteFile = async (fileKey) => {
  const response = await fetch(`https://api-staging.cleyfi.com/upload/file/${encodeURIComponent(fileKey)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

### 5. Get User Files

Get a list of files uploaded by the user.

**Endpoint:** `GET /upload/files`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `folder` (optional): Filter by folder name

**Response:**
```json
{
  "message": "User files retrieved successfully",
  "files": [
    {
      "id": "uuid",
      "key": "uploads/my-file-abc123.jpg",
      "originalName": "my-file.jpg",
      "size": 1024000,
      "contentType": "image/jpeg",
      "folder": "uploads",
      "url": "https://cleyverse-digital-files-staging-xyz.s3.us-east-1.amazonaws.com/uploads/my-file-abc123.jpg",
      "uploadedAt": "2025-01-18T23:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1
  }
}
```

**Example (JavaScript):**
```javascript
const getUserFiles = async (page = 1, limit = 20, folder = null) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (folder) {
    params.append('folder', folder);
  }

  const response = await fetch(`https://api-staging.cleyfi.com/upload/files?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
};
```

### 6. Get File Info

Get detailed information about a specific file.

**Endpoint:** `GET /upload/file/:key`

**Response:**
```json
{
  "message": "File info retrieved successfully",
  "file": {
    "id": "uuid",
    "key": "uploads/my-file-abc123.jpg",
    "originalName": "my-file.jpg",
    "fileName": "my-file-abc123.jpg",
    "size": 1024000,
    "contentType": "image/jpeg",
    "folder": "uploads",
    "extension": "jpg",
    "status": "active",
    "url": "https://cleyverse-digital-files-staging-xyz.s3.us-east-1.amazonaws.com/uploads/my-file-abc123.jpg",
    "uploadedAt": "2025-01-18T23:00:00.000Z",
    "updatedAt": "2025-01-18T23:00:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "No file provided",
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 413 Payload Too Large
```json
{
  "message": "File too large",
  "error": "Bad Request",
  "statusCode": 400
}
```

## Frontend Integration Examples

### React Component Example

```jsx
import React, { useState } from 'react';

const FileUpload = ({ token, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // For small files (< 5MB), use direct upload
      if (file.size < 5 * 1024 * 1024) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'uploads');

        const response = await fetch('https://api-staging.cleyfi.com/upload/file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();
        onUploadSuccess(result.file);
      } else {
        // For larger files, use presigned URL
        const presignedResponse = await fetch('https://api-staging.cleyfi.com/upload/presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            folder: 'uploads',
            maxFileSize: file.size,
          }),
        });

        const presignedData = await presignedResponse.json();

        // Upload directly to S3
        const formData = new FormData();
        formData.append('file', file);
        Object.entries(presignedData.fields).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const uploadResponse = await fetch(presignedData.uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          onUploadSuccess({
            key: presignedData.key,
            url: `https://cleyverse-digital-files-staging-xyz.s3.us-east-1.amazonaws.com/${presignedData.key}`,
            originalName: file.name,
            size: file.size,
            contentType: file.type,
          });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <div>Uploading... {progress}%</div>}
    </div>
  );
};

export default FileUpload;
```

### Vue.js Component Example

```vue
<template>
  <div>
    <input
      type="file"
      @change="handleFileUpload"
      :disabled="uploading"
    />
    <div v-if="uploading">Uploading... {{ progress }}%</div>
  </div>
</template>

<script>
export default {
  props: ['token'],
  data() {
    return {
      uploading: false,
      progress: 0,
    };
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      this.progress = 0;

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'uploads');

        const response = await fetch('https://api-staging.cleyfi.com/upload/file', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
          body: formData,
        });

        const result = await response.json();
        this.$emit('upload-success', result.file);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        this.uploading = false;
        this.progress = 0;
      }
    },
  },
};
</script>
```

## Best Practices

### 1. File Validation
Always validate files on the frontend before uploading:

```javascript
const validateFile = (file) => {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain',
    'video/mp4', 'video/avi', 'video/mov',
    'audio/mpeg', 'audio/wav',
    'application/zip', 'application/x-rar-compressed'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  if (file.size > maxSize) {
    throw new Error('File too large');
  }

  return true;
};
```

### 2. Progress Tracking
For large files, implement progress tracking:

```javascript
const uploadWithProgress = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      onProgress(percentComplete);
    }
  });

  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));

    xhr.open('POST', 'https://api-staging.cleyfi.com/upload/file');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};
```

### 3. Error Handling
Implement proper error handling:

```javascript
const handleUploadError = (error) => {
  if (error.status === 400) {
    return 'Invalid file or request';
  } else if (error.status === 401) {
    return 'Please log in to upload files';
  } else if (error.status === 413) {
    return 'File is too large';
  } else {
    return 'Upload failed. Please try again.';
  }
};
```

## Security Notes

1. **Authentication Required**: All endpoints require valid JWT tokens
2. **File Type Validation**: Only allowed file types are accepted
3. **Size Limits**: Files are limited to 10MB maximum
4. **Access Control**: Users can only access their own files
5. **Signed URLs**: Download URLs expire after 1 hour by default

## Rate Limits

- **Upload requests**: 100 requests per minute per user
- **Download requests**: 1000 requests per minute per user
- **File operations**: 500 requests per minute per user

---

**Last Updated**: January 2025
**Version**: 1.0
**Environment**: Staging
**Status**: Active
