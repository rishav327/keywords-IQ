export const metadata = {
  title: "KeywordIQ — AI Keyword Research Tool",
  description: "Find high-opportunity keywords for your blog using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#0A0F1E" }}>
        {children}
      </body>
    </html>
  );
}
