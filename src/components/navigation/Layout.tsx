import Navbar from "./Navbar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen divide-x">
      <Navbar />
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
}
