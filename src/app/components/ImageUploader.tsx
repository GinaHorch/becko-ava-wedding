"use client"
import { useDropzone } from 'react-dropzone';

export default function ImageUploader() {
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <div {...getRootProps()} className="border-dashed border-2 p-6 rounded">
      <input {...getInputProps()} />
      <p>Drag & drop your photo here, or click to select a file</p>
    </div>
  );
}
