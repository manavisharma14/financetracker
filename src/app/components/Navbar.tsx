import AuthButtons from "./AuthButtons";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center">
      {/* App Logo / Title */}
      <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
        my money tracker 💸
      </h1>

      {/* Auth Section */}
      <AuthButtons />
    </nav>
  );
}