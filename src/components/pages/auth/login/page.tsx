import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/login.webp')",
      }}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative w-full max-w-sm z-10">
        <LoginForm/>
      </div>
    </div>
  );
}
