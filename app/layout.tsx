import "./globals.css";
import "./soft-modern.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="und">
      <head>
        <meta name="naver-site-verification" content="80776c473759c6db44eb27a74ff13680b1d4af03" />
      </head>
      <body>{children}</body>
    </html>
  );
}
