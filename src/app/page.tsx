'use client';
import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Nav from '@/components/Nav';
import HeroIntro from '@/components/HeroIntro';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const handleLoadDone = useCallback(() => setLoading(false), []);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen key="loader" onDone={handleLoadDone} />}
      </AnimatePresence>

      <main style={{ pointerEvents: loading ? 'none' : 'auto', background: '#000000', minHeight: '100vh' }}>
        <Nav />
        <HeroIntro />
      </main>
    </>
  );
}
