export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        backgroundColor: '#080808',
        backgroundImage: `
          linear-gradient(rgba(99, 102, 241, 0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99, 102, 241, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}
    >
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
