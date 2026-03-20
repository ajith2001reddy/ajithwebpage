import { Inter } from 'next/font/google';
import './globals.css';
import SpaceStage from '@/components/3d/SpaceStage';
import AutonomousAstronautBrain from '@/components/AutonomousAstronautBrain';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Ajith Pavan Reddy | Systems Engineer & AI Specialist',
  description: 'Portfolio showcasing full-stack development, distributed systems, and AI-powered applications. Engineering high-fidelity digital products with precision and intention.',
  keywords: ['Systems Engineering', 'Full Stack', 'AI/ML', 'Backend Infrastructure', 'Data Engineering'],
  openGraph: {
    title: 'Ajith Pavan Reddy',
    description: 'Engineering precision systems with elegant design',
    url: 'https://ajithpavanreddy.com',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden bg-white dark:bg-black text-gray-900 dark:text-white`}>
        {/* AI Brain - Controls astronaut autonomously */}
        <AutonomousAstronautBrain />

        {/* 3D Astronaut Canvas */}
        <SpaceStage />

        {children}
      </body>
    </html>
  );
}