"use client";

// Last-resort page when even the root layout fails to render
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", textAlign: "center", padding: "4rem 1rem" }}>
        <h2>Something went wrong</h2>
        <p>Please try again.</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
