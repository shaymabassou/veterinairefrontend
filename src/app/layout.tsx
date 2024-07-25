// app/layout.tsx
import React from 'react';
import { Inter } from 'next/font/google'; // Exemple d'importation de polices
import './globals.css'; // Importation des styles globaux

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'site veterinaire',
  description: 'Description de votre site',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header>
          <nav>
            {/* Ajoutez ici votre composant de barre de navigation */}
          </nav>
        </header>
        <main>
          {children}
        </main>
        <footer>
          {/* Ajoutez ici votre composant de pied de page */}
        </footer>
      </body>
    </html>
  );
}
