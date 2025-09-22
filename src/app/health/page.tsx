export const dynamic = "force-dynamic"; // fuerza SSR en cada hit
export const revalidate = 0;

export default async function HealthPage() {
  // Simulá algo mínimo de SSR
  const now = new Date().toISOString();

  return (
    <html>
      <head>
        <meta name="robots" content="noindex,nofollow" />
        <title>HEALTH OK</title>
      </head>
      <body>
        <main style={{ fontFamily: "system-ui", padding: 16, height: "100vh" }}>
          <h1>HEALTH RENDER OK</h1>
          <p data-now={now}>timestamp: {now}</p>
          {/* palabra clave para Kuma */}
          <p>
            keyword: <strong>FRONT_RENDER_OK</strong>
          </p>
        </main>
      </body>
    </html>
  );
}
