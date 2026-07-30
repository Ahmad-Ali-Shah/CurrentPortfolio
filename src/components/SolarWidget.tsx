'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// P(G,T,θ) = 0.808·G − 2.548·T − 4.9204·θ + 223.0904
function calcPower(G: number, T: number, theta: number) {
  return 0.808 * G - 2.548 * T - 4.9204 * theta + 223.0904;
}

// ── Regression canvas ─────────────────────────────────────────────
function RegressionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);

  const draw = useCallback((pts: { x: number; y: number }[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(100,140,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const x = (W / 8) * i; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      const y = (H / 6) * i; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Axis labels hint
    ctx.fillStyle = 'rgba(100,140,255,0.35)';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillText('Irradiance →', 8, H - 8);
    ctx.save(); ctx.translate(12, H - 20); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Power ↑', 0, 0); ctx.restore();

    // Data points
    pts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100,140,255,0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(100,140,255,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Regression line (simple linear: y = mx + b on canvas coords)
    if (pts.length >= 2) {
      const n = pts.length;
      const sx = pts.reduce((a, p) => a + p.x, 0);
      const sy = pts.reduce((a, p) => a + p.y, 0);
      const sxy = pts.reduce((a, p) => a + p.x * p.y, 0);
      const sx2 = pts.reduce((a, p) => a + p.x * p.x, 0);
      const m = (n * sxy - sx * sy) / (n * sx2 - sx * sx);
      const b = (sy - m * sx) / n;
      const x0 = 0, y0 = m * x0 + b;
      const x1 = W, y1 = m * x1 + b;

      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, 'rgba(100,140,255,0.8)');
      grad.addColorStop(1, 'rgba(180,130,255,0.8)');
      ctx.beginPath();
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // R² hint
      const yMean = sy / n;
      const ssTot = pts.reduce((a, p) => a + (p.y - yMean) ** 2, 0);
      const ssRes = pts.reduce((a, p) => a + (p.y - (m * p.x + b)) ** 2, 0);
      const r2 = ssTot ? 1 - ssRes / ssTot : 0;
      ctx.fillStyle = 'rgba(100,140,255,0.5)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(`R² = ${r2.toFixed(3)}`, W - 80, 16);
    }
  }, []);

  useEffect(() => { draw(points); }, [points, draw]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((prev) => [...prev, { x, y }]);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs" style={{ color: 'rgba(226,232,240,0.4)', fontFamily: 'JetBrains Mono, monospace' }}>
        Click to add data points → live regression line
      </p>
      <canvas
        ref={canvasRef}
        width={360} height={220}
        onClick={handleClick}
        style={{
          width: '100%', height: 'auto',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(100,140,255,0.1)',
          borderRadius: '0.75rem',
          cursor: 'crosshair',
        }}
      />
      {points.length > 0 && (
        <button
          onClick={() => setPoints([])}
          className="text-xs px-3 py-1 rounded-md transition-colors"
          style={{ color: 'rgba(226,232,240,0.35)', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent' }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

// ── Solar Panel Widget ────────────────────────────────────────────
export default function SolarWidget() {
  const [G, setG] = useState(600);
  const [T, setT] = useState(25);
  const [theta, setTheta] = useState(20);
  const power = calcPower(G, T, theta);
  const powerNorm = Math.max(0, Math.min(1, (power + 50) / 1100));

  const SliderField = ({ label, value, min, max, unit, onChange, color }: {
    label: string; value: number; min: number; max: number; unit: string;
    onChange: (v: number) => void; color: string;
  }) => (
    <div>
      <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <span style={{ color: 'rgba(226,232,240,0.5)' }}>{label}</span>
        <span style={{ color }}>{value} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none"
        style={{ accentColor: color }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Panel visual */}
      <div className="flex flex-col items-center gap-4">
        <div style={{ position: 'relative', width: '140px' }}>
          {/* Light rays */}
          <motion.div
            style={{
              position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
              width: `${40 + powerNorm * 60}px`, height: `${40 + powerNorm * 60}px`,
              background: `radial-gradient(circle, rgba(255,220,80,${0.1 + powerNorm * 0.4}) 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Panel — tilts by theta */}
          <motion.div
            animate={{ rotateX: theta * 0.6, rotateY: -8 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            style={{ transformStyle: 'preserve-3d', perspective: '400px' }}
          >
            <div className="solar-panel-visual mx-auto">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="solar-cell"
                  animate={{ background: `linear-gradient(135deg, hsl(215,60%,${15 + powerNorm * 15}%), hsl(215,50%,${10 + powerNorm * 10}%))` }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Power readout */}
        <div className="text-center">
          <motion.p
            className="text-3xl font-black"
            style={{ fontFamily: 'Outfit, sans-serif', color: power > 0 ? 'hsl(220,80%,65%)' : 'hsl(0,70%,60%)' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {power.toFixed(1)} W
          </motion.p>
          <p className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.35)', fontFamily: 'JetBrains Mono, monospace' }}>
            P(G,T,θ) = 0.808G − 2.548T − 4.9204θ + 223.09
          </p>
        </div>
      </div>

      {/* Sliders */}
      <div className="glass p-4 space-y-4">
        <SliderField label="Irradiance (G)" value={G} min={200} max={1000} unit="W/m²" onChange={setG} color="hsl(48,90%,60%)" />
        <SliderField label="Temperature (T)" value={T} min={15} max={45} unit="°C" onChange={setT} color="hsl(0,70%,65%)" />
        <SliderField label="Angle (θ)" value={theta} min={0} max={60} unit="°" onChange={setTheta} color="hsl(180,60%,55%)" />
      </div>

      {/* Key results */}
      <div className="grid grid-cols-2 gap-2 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        {[
          { label: 'Max Power', value: '992.87 W', sub: 'G=1000, T=15, θ=0°' },
          { label: 'Min Power', value: '−25.19 W', sub: 'G=200, T=45, θ=60°' },
          { label: 'Avg Power', value: '482.54 W', sub: 'Triple integral result' },
          { label: 'Best Location', value: 'Desert', sub: '839.57 W predicted' },
        ].map((s) => (
          <div key={s.label} className="glass-sm p-3">
            <p style={{ color: 'rgba(226,232,240,0.4)' }}>{s.label}</p>
            <p className="font-bold" style={{ color: '#e2e8f0' }}>{s.value}</p>
            <p style={{ color: 'rgba(226,232,240,0.25)', fontSize: '10px' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Regression canvas */}
      <RegressionCanvas />
    </div>
  );
}
