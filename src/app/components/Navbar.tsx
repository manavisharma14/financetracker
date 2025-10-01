import AuthButtons from "./AuthButtons";
export default function Navbar() {
    return (
        <nav className="w-full p-4 border-b border-gray-300 flex justify-between items-center">
            <h1>Finance Tracker</h1>
            <AuthButtons />

        </nav>
    )
}