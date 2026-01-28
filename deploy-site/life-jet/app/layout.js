import './globals.css'

export const metadata = {
  title: 'LIFE JET - Command Center',
  description: 'Military-style meal finder and achievement center',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/phosphor-icons/Fonts/regular/vision-board-icons.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
