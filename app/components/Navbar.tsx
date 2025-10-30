'use client';

import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export default function Navbar({ onSearch, searchQuery }: NavbarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <Link href="/" className="flex items-center justify-center sm:justify-start shrink-0">
            <Image
              src="/logo.svg"
              alt="Highway Delite Logo"
              width={140}
              height={48}
              className="object-contain"
            />
          </Link>

          <form onSubmit={handleSubmit} className="w-full sm:flex-1 sm:max-w-2xl sm:ml-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Search experiences"
                value={searchQuery}
                onChange={handleChange}
                className="w-full sm:flex-1 px-4 py-3 bg-[#EDEDED] text-[#2D2D2D] placeholder-[#727272] rounded-md"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-[#FFD643] text-[#161616] font-medium rounded-md hover:bg-yellow-500 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
}