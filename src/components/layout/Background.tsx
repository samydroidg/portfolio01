export default function Background() {
  return (
    <>
      {/* Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-grid opacity-[0.4] dark:opacity-100" aria-hidden="true" />

      {/* Ambient blobs — very slow independent movement */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[-15%] left-[-5%] w-[35%] h-[35%] rounded-full bg-accent/3 dark:bg-accent/4"
          style={{
            filter: 'blur(160px)',
            animation: 'drift 40s ease-in-out infinite alternate',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/3 dark:bg-indigo-500/4"
          style={{
            filter: 'blur(160px)',
            animation: 'drift 50s ease-in-out infinite alternate-reverse',
          }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[20%] h-[20%] rounded-full bg-purple-500/2 dark:bg-purple-500/3"
          style={{
            filter: 'blur(120px)',
            animation: 'drift 35s ease-in-out infinite alternate',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Noise */}
      <div className="bg-noise" aria-hidden="true" />
    </>
  );
}
