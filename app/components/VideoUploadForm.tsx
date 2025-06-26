"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface FormData {
  title: string;
  description: string;
  file: File | null;
}

export default function VideoUploadForm() {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    file: null,
  });

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      if (!form.file) {
        setError("Please select a video file.");
        setUploading(false);
        return;
      }

      // 1. Get ImageKit upload credentials
      const { data: auth } = await axios.get("/api/auth/imagekit-auth");

      // 2. Prepare formData
      const videoData = new FormData();
      videoData.append("file", form.file);
      videoData.append("fileName", form.title);
      videoData.append("publicKey", auth.publicKey);
      videoData.append("signature", auth.signature);
      videoData.append("expire", auth.expire);
      videoData.append("token", auth.token);

      // 3. Upload to ImageKit
      const res = await axios.post("https://upload.imagekit.io/api/v1/files", videoData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 4. Send to your backend
      await axios.post("/api/video", {
        title: form.title,
        description: form.description,
        url: res.data.url,
      });

      setSuccess(true);
      setForm({ title: "", description: "", file: null });
    } catch (err: any) {
      console.error(err);
      setError("Video upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Upload a Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Video title"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          required
        />
        <textarea
          name="description"
          placeholder="Video description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-xl focus:outline-none"
          rows={3}
        />
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="w-full"
          required
        />
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          {uploading ? "Uploading..." : "Upload Video"}
        </button>

        {success && (
          <p className="text-green-600 text-sm text-center">Video uploaded successfully!</p>
        )}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </motion.div>
  );
}
