'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-800 dark:text-white flex flex-col items-center justify-center px-4 py-20">
      <Image
        src="/logo.svg" // Replace with your logo if available
        alt="My Media Cloud"
        width={80}
        height={80}
        className="mb-4 dark:invert"
      />
      <h1 className="text-4xl font-bold mb-2">My Media Cloud</h1>
      <p className="text-center max-w-xl text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
        Upload, manage, and share your videos securely with ImageKit and Next.js.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/upload"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm sm:text-base text-center"
        >
          Upload a Video
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-sm sm:text-base text-center"
        >
          View Uploaded Videos
        </Link>
      </div>
    </div>
  );
}
