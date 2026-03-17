export default function MainPage({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 p-4 md:p-8">{children}</div>;
}
