import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary-500 text-primary-50">
      <h1 className="mb-4 text-3xl font-bold">App init</h1>
      <p className="mb-6 text-sm">
        This background uses the Tailwind brand color.
      </p>
      <Button variant="secondary">Click me</Button>
    </main>
  );
}
