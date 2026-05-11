import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      class="font-mono text-sm px-2 py-1 border border-current opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
    >
      {isDark ? '[light]' : '[dark]'}
    </button>
  );
}
