// Header.tsx
import { Menu } from 'lucide-react';
import { CurrentTime } from '../CurrentTime';

type Props = {
  onMenuClick: () => void;
};

export  function Header({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white shadow px-6 py-4 border-b">
      <button onClick={onMenuClick} className="md:hidden p-2 rounded hover:bg-gray-100">
        <Menu size={24} />
      </button>

     <h2 className="text-xl font-semibold text-green-700">
  {/* Show logo only on small screens */}
  <span className="block md:hidden">نصر الإسلام</span>
</h2>

      <div>
        <CurrentTime />
      </div>
    </header>
  );
}
