import "./globals.css";
import Nav from "../components/Nav";

export const metadata = {
  title: "UNIVA",
  description: "Tous les univers, au même endroit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen w-full flex justify-center">
          <div className="w-full max-w-md px-4 pt-6 pb-24">{children}</div>
        </div>
        <Nav />
      </body>
    </html>
  );
}
