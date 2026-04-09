export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100">
      <div className="w-full max-w-md p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
        {children}
      </div>
    </div>
  );
}
