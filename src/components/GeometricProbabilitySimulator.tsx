'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Info, Target } from 'lucide-react';

interface Disk {
  id: number;
  x: number;
  y: number;
  isInside: boolean;
}

interface SimulatorSettings {
  tileSize: number;
  diskDiameter: number;
}

export default function GeometricProbabilitySimulator() {
  const [disks, setDisks] = useState<Disk[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [speed, setSpeed] = useState(500); // ms between throws
  const [settings, setSettings] = useState<SimulatorSettings>({
    tileSize: 4,
    diskDiameter: 2,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate statistics
  const totalThrows = disks.length;
  const insideCount = disks.filter(d => d.isInside).length;
  const experimentalProbability = totalThrows > 0 ? insideCount / totalThrows : 0;

  // Theoretical probability
  const safeZoneSize = settings.tileSize - settings.diskDiameter;
  const theoreticalProbability = safeZoneSize > 0
    ? (safeZoneSize * safeZoneSize) / (settings.tileSize * settings.tileSize)
    : 0;

  // Check if disk center is in the safe zone
  const isDiskInside = useCallback((x: number, y: number) => {
    const radius = settings.diskDiameter / 2;
    const margin = radius;

    // Get position within tile (0 to tileSize)
    const xInTile = ((x % settings.tileSize) + settings.tileSize) % settings.tileSize;
    const yInTile = ((y % settings.tileSize) + settings.tileSize) % settings.tileSize;

    // Check if center is at least 'radius' away from all edges
    return xInTile >= margin &&
           xInTile <= settings.tileSize - margin &&
           yInTile >= margin &&
           yInTile <= settings.tileSize - margin;
  }, [settings]);

  // Throw a single disk
  const throwDisk = useCallback(() => {
    const x = Math.random() * settings.tileSize;
    const y = Math.random() * settings.tileSize;
    const isInside = isDiskInside(x, y);

    const newDisk: Disk = {
      id: Date.now() + Math.random(),
      x,
      y,
      isInside,
    };

    setDisks(prev => [...prev.slice(-499), newDisk]); // Keep last 500 disks
  }, [settings.tileSize, isDiskInside]);

  // Throw multiple disks quickly
  const throwMany = (count: number) => {
    const newDisks: Disk[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * settings.tileSize;
      const y = Math.random() * settings.tileSize;
      const isInside = isDiskInside(x, y);
      newDisks.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        isInside,
      });
    }
    setDisks(prev => [...prev.slice(-(500 - count)), ...newDisks]);
  };

  // Auto-throw control
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(throwDisk, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, speed, throwDisk]);

  // Draw the tile visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 80; // pixels per unit
    const padding = 20;
    const tilePixels = settings.tileSize * scale;

    canvas.width = tilePixels + padding * 2;
    canvas.height = tilePixels + padding * 2;

    // Clear canvas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tile background
    ctx.fillStyle = '#334155';
    ctx.fillRect(padding, padding, tilePixels, tilePixels);

    // Draw tile border
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, tilePixels, tilePixels);

    // Draw safe zone if enabled
    if (showSafeZone && safeZoneSize > 0) {
      const safeZonePixels = safeZoneSize * scale;
      const margin = (settings.diskDiameter / 2) * scale;

      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(padding + margin, padding + margin, safeZonePixels, safeZonePixels);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(padding + margin, padding + margin, safeZonePixels, safeZonePixels);
      ctx.setLineDash([]);
    }

    // Draw dimension labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';

    // Tile size label
    ctx.fillText(`${settings.tileSize}"`, padding + tilePixels / 2, padding - 5);

    // Safe zone label if shown
    if (showSafeZone && safeZoneSize > 0) {
      const margin = (settings.diskDiameter / 2) * scale;
      ctx.fillStyle = '#22c55e';
      ctx.fillText(`${safeZoneSize}"`, padding + margin + (safeZoneSize * scale) / 2, padding + margin - 5);
    }

    // Draw recent disks (last 50 for performance)
    const recentDisks = disks.slice(-50);
    recentDisks.forEach((disk, index) => {
      const alpha = 0.3 + (index / recentDisks.length) * 0.7;
      const diskX = padding + disk.x * scale;
      const diskY = padding + disk.y * scale;
      const diskRadius = (settings.diskDiameter / 2) * scale;

      // Draw disk
      ctx.beginPath();
      ctx.arc(diskX, diskY, diskRadius, 0, Math.PI * 2);
      ctx.fillStyle = disk.isInside
        ? `rgba(34, 197, 94, ${alpha * 0.3})`
        : `rgba(239, 68, 68, ${alpha * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = disk.isInside
        ? `rgba(34, 197, 94, ${alpha})`
        : `rgba(239, 68, 68, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw center point for the most recent disk
      if (index === recentDisks.length - 1) {
        ctx.beginPath();
        ctx.arc(diskX, diskY, 3, 0, Math.PI * 2);
        ctx.fillStyle = disk.isInside ? '#22c55e' : '#ef4444';
        ctx.fill();
      }
    });

  }, [disks, settings, showSafeZone, safeZoneSize]);

  const reset = () => {
    setIsRunning(false);
    setDisks([]);
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-green-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Geometric Probability Simulator</h2>
          <p className="text-slate-400 text-sm">Disk Landing on Tiles (Example 1.1-2)</p>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-blue-200 text-sm">
            <p className="font-semibold mb-1">The Problem:</p>
            <p>A disk {settings.diskDiameter}" in diameter is thrown at random on a floor tiled with {settings.tileSize}"×{settings.tileSize}" squares. What's the probability it lands entirely within one tile?</p>
            <p className="mt-2 text-blue-300">
              <strong>Key Insight:</strong> The disk's <em>center</em> must land at least {settings.diskDiameter / 2}" from each edge. The center can only land in a {safeZoneSize}"×{safeZoneSize}" "safe zone"!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canvas */}
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            className="rounded-lg bg-slate-900 cursor-crosshair"
            onClick={(e) => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              const rect = canvas.getBoundingClientRect();
              const scale = 80;
              const padding = 20;
              const x = (e.clientX - rect.left - padding) / scale;
              const y = (e.clientY - rect.top - padding) / scale;
              if (x >= 0 && x <= settings.tileSize && y >= 0 && y <= settings.tileSize) {
                const isInside = isDiskInside(x, y);
                setDisks(prev => [...prev.slice(-499), { id: Date.now(), x, y, isInside }]);
              }
            }}
          />
          <p className="text-slate-400 text-xs mt-2">Click to throw a disk manually</p>
        </div>

        {/* Controls & Stats */}
        <div className="space-y-4">
          {/* Statistics */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Throws</p>
                <p className="text-2xl font-bold text-white">{totalThrows}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Inside Tile</p>
                <p className="text-2xl font-bold text-green-400">{insideCount}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Experimental P</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {experimentalProbability.toFixed(4)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Theoretical P</p>
                <p className="text-2xl font-bold text-blue-400">
                  {theoreticalProbability.toFixed(4)}
                </p>
                <p className="text-slate-500 text-xs">
                  = {safeZoneSize}²/{settings.tileSize}² = {safeZoneSize * safeZoneSize}/{settings.tileSize * settings.tileSize}
                </p>
              </div>
            </div>

            {/* Error bar */}
            {totalThrows > 0 && (
              <div className="mt-4">
                <p className="text-slate-400 text-sm mb-1">
                  Difference: {Math.abs(experimentalProbability - theoreticalProbability).toFixed(4)}
                </p>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (1 - Math.abs(experimentalProbability - theoreticalProbability) / theoreticalProbability) * 100)}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? 'Pause' : 'Auto'}
            </button>

            <button
              onClick={() => throwMany(100)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              +100
            </button>

            <button
              onClick={() => throwMany(500)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              +500
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Settings */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-sm">Show Safe Zone</label>
                <button
                  onClick={() => setShowSafeZone(!showSafeZone)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showSafeZone ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    showSafeZone ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div>
                <label className="text-slate-300 text-sm">Tile Size: {settings.tileSize}"</label>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={settings.tileSize}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, tileSize: Number(e.target.value) }));
                    reset();
                  }}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Disk Diameter: {settings.diskDiameter}"</label>
                <input
                  type="range"
                  min="1"
                  max={settings.tileSize - 0.5}
                  step="0.5"
                  value={settings.diskDiameter}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, diskDiameter: Number(e.target.value) }));
                    reset();
                  }}
                  className="w-full mt-1"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Speed: {speed}ms</label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full mt-1"
                />
              </div>
            </div>
          </div>

          {/* Formula Explanation */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-2">The Math</h3>
            <div className="text-slate-300 text-sm space-y-2 font-mono">
              <p>P(inside) = (Safe Zone Area) / (Tile Area)</p>
              <p className="text-green-400">
                = ({settings.tileSize} - {settings.diskDiameter})² / {settings.tileSize}²
              </p>
              <p className="text-green-400">
                = {safeZoneSize}² / {settings.tileSize}²
              </p>
              <p className="text-green-400 font-bold">
                = {safeZoneSize * safeZoneSize}/{settings.tileSize * settings.tileSize} = {theoreticalProbability.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
