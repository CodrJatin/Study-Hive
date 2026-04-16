import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#fcf9f8]/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-surface-container-high z-[60] flex items-center justify-between px-6 md:px-8">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
        {/* Brand Logo or Breadcrumb */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-3 text-sm font-medium h-6">
            <span className="text-xl font-bold text-primary tracking-tighter font-headline">
              StudyHive
            </span>
          </nav>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="flex-grow max-w-2xl hidden md:flex items-center px-4 py-2 bg-surface-container-high rounded-full focus-within:bg-surface-container-lowest focus-within:ring-2 ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 w-full text-sm font-body outline-none"
            placeholder="Search Hives, notes, or curators..."
            type="text"
          />
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
          </button>
          <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined">apps</span>
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container hover:ring-2 ring-primary/20 transition-all cursor-pointer">
            <img
              alt="User profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlmh4SVi576r1aZOcrwm4Nb-Z6oWZGrzK0oml3eWVKcFL0iDJKWO3n2wwetx-bFfv_WHe1jH32wckfk1pLJfjW1UrjEl8HfYZu0lei6fJ3mz8JnuUuWs17tH7XODEAtjgvYj4XexVtrdIHDPaV5KuA9kEfMVYd7gSD-rivyEWt4iAA5X3MRsKDgpyG4u59Y5z6k1orX6EdXBY8MgZUcjp5cEBFBdbod-mbzotbjgx4NyUKaPK1fT9bIZOphM3-iVUQBrSUAWzBkg"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
