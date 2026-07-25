import { motion } from 'motion/react';

const printLayers = Array.from({ length: 34 }, (_, index) => {
  const progress = index / 33;
  // A more realistic organic shape profile (like a futuristic mech helmet or turbine core)
  const widthMultiplier = 1 - Math.pow(progress - 0.5, 2) * 0.9;
  return {
    id: index,
    y: 405 - index * 3.4,
    width: (55 + Math.sin(progress * Math.PI * 2.5) * 16) * widthMultiplier,
    delay: index * 0.09,
  };
});

export default function PrinterAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="flex w-full items-center justify-center"
    >
      <div className="relative w-full max-w-[760px]">
        <svg
          viewBox="0 0 820 650"
          className="h-auto w-full overflow-visible drop-shadow-[0_45px_70px_rgba(2,24,28,0.55)]"
          role="img"
          aria-label="طابعة ثلاثية الأبعاد احترافية عالية الواقعية أثناء عملية التصنيع"
        >
          <defs>
            {/* Ultra Realistic Metallic Gradients */}
            <linearGradient id="anodizedAluminum" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2c3540" />
              <stop offset="25%" stopColor="#1a222c" />
              <stop offset="50%" stopColor="#3d4a59" />
              <stop offset="75%" stopColor="#151b22" />
              <stop offset="100%" stopColor="#0d1117" />
            </linearGradient>

            <linearGradient id="gantryBeam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f5d6f" />
              <stop offset="20%" stopColor="#2b3440" />
              <stop offset="80%" stopColor="#1b232c" />
              <stop offset="100%" stopColor="#0f141a" />
            </linearGradient>

            <linearGradient id="stepperMotor" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e252e" />
              <stop offset="50%" stopColor="#3a4756" />
              <stop offset="100%" stopColor="#151a21" />
            </linearGradient>

            <linearGradient id="heatedBed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#141c24" />
              <stop offset="85%" stopColor="#0a0f15" />
              <stop offset="100%" stopColor="#06090d" />
            </linearGradient>

            <linearGradient id="moltenFilament" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#67e8f9" />
              <stop offset="60%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>

            <radialGradient id="nozzleHeatGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff7b00" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#ff3300" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff0000" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="bedLED" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>

            <filter id="realisticShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="25" stdDeviation="20" floodColor="#01161a" floodOpacity="0.5" />
            </filter>

            <filter id="intenseGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComponentTransfer in="blur" result="brightBlur">
                <feFuncA type="linear" slope="1.8" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode in="brightBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Floor Contact Shadow */}
          <ellipse cx="410" cy="595" rx="280" ry="18" fill="#031114" opacity="0.45" />

          {/* --- MAIN PRINTER CHASSIS & FRAME --- */}
          <g filter="url(#realisticShadow)">
            {/* Base Enclosure / Electronics Housing */}
            <rect x="150" y="495" width="520" height="65" rx="12" fill="url(#anodizedAluminum)" stroke="#475569" strokeWidth="1.5" />
            
            {/* Rubber Feet */}
            <rect x="180" y="560" width="55" height="10" rx="4" fill="#0b0f14" />
            <rect x="585" y="560" width="55" height="10" rx="4" fill="#0b0f14" />

            {/* Front Control Panel & OLED Screen */}
            <rect x="195" y="512" width="180" height="38" rx="6" fill="#070a0f" stroke="#1e293b" strokeWidth="2" />
            <rect x="207" y="520" width="110" height="6" rx="3" fill="#22d3ee" opacity="0.9" />
            <rect x="207" y="532" width="75" height="4" rx="2" fill="#64748b" opacity="0.7" />
            <circle cx="345" cy="531" r="11" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="345" cy="531" r="4" fill="#22d3ee" />

            {/* Brand Badge */}
            <rect x="530" y="515" width="105" height="32" rx="4" fill="#0a0e14" stroke="#334155" strokeWidth="1" />
            <text x="582" y="535" fill="#e2e8f0" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="2" textAnchor="middle">3D TECH</text>

            {/* Vertical Extrusion Profiles (Left & Right Aluminum Towers) */}
            <rect x="185" y="110" width="34" height="395" rx="4" fill="url(#gantryBeam)" stroke="#475569" strokeWidth="1.5" />
            <line x1="202" y1="110" x2="202" y2="505" stroke="#000000" strokeWidth="2" opacity="0.6" />

            <rect x="601" y="110" width="34" height="395" rx="4" fill="url(#gantryBeam)" stroke="#475569" strokeWidth="1.5" />
            <line x1="618" y1="110" x2="618" y2="505" stroke="#000000" strokeWidth="2" opacity="0.6" />

            {/* Top Frame Crossbar */}
            <rect x="165" y="90" width="490" height="30" rx="6" fill="url(#anodizedAluminum)" stroke="#475569" strokeWidth="1.5" />
            
            {/* Filament Spool Holder & Spool on Top */}
            <path d="M410 90 V45" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
            <circle cx="410" cy="40" r="32" fill="none" stroke="#0891b2" strokeWidth="12" strokeDasharray="160 25" strokeDashoffset="10" />
            <circle cx="410" cy="40" r="32" fill="none" stroke="#164e63" strokeWidth="12" opacity="0.6" />
            <circle cx="410" cy="40" r="10" fill="#cbd5e1" />

            {/* Filament Guide Tube (PTFE Bowden Tube - Realistic Curved Path) */}
            <path d="M410 72 C410 30 580 30 595 135" fill="none" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
            <path d="M410 72 C410 30 580 30 595 135" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 8" />

            {/* Smooth Steel Rods (Z-Axis Lead Screws & Guide Rails) */}
            <line x1="228" y1="120" x2="228" y2="500" stroke="#cbd5e1" strokeWidth="3" />
            <line x1="592" y1="120" x2="592" y2="500" stroke="#cbd5e1" strokeWidth="3" />

            {/* Heated Print Bed Assembly */}
            <g transform="translate(0, 0)">
              {/* Bed Carriage Bracket */}
              <rect x="235" y="435" width="350" height="18" rx="4" fill="#334155" stroke="#64748b" strokeWidth="1" />
              
              {/* Glass/Magnetic Build Plate */}
              <rect x="250" y="420" width="320" height="20" rx="3" fill="url(#heatedBed)" stroke="#475569" strokeWidth="1.5" />
              
              {/* Build Surface Grid Lines */}
              <rect x="270" y="424" width="280" height="12" fill="#06090f" />
              <line x1="410" y1="424" x2="410" y2="436" stroke="#1e293b" strokeWidth="1" />
              <line x1="270" y1="430" x2="550" y2="430" stroke="#1e293b" strokeWidth="1" />

              {/* Bed leveling knobs under corners */}
              <circle cx="280" cy="445" r="7" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <circle cx="540" cy="445" r="7" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
            </g>
          </g>

          {/* --- REALISTIC DYNAMIC PRINTED OBJECT (ANIMATED LAYER BY LAYER) --- */}
          <g filter="url(#intenseGlow)">
            {printLayers.map((layer, index) => (
              <motion.rect
                key={layer.id}
                x={410 - layer.width / 2}
                y={layer.y}
                width={layer.width}
                height="3.6"
                rx="1.8"
                fill="url(#moltenFilament)"
                initial={{ opacity: 0, scaleX: 0.1 }}
                animate={{
                  opacity: [0, 0, 1, 1, 0],
                  scaleX: [0.1, 0.1, 1, 1, 0.1],
                }}
                transition={{
                  duration: 8.5,
                  delay: layer.delay,
                  repeat: Infinity,
                  repeatDelay: 0.8,
                  times: [0, 0.05, 0.15, 0.88, 1],
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: '410px center' }}
              />
            ))}

            {/* Molten Pool Spark / Active Nozzle Glow Point */}
            <motion.ellipse
              cx="410"
              cy="405"
              rx="24"
              ry="5"
              fill="url(#nozzleHeatGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0.95, 0.95, 0] }}
              transition={{
                duration: 8.5,
                repeat: Infinity,
                repeatDelay: 0.8,
                times: [0, 0.05, 0.15, 0.88, 1],
              }}
            />
          </g>

          {/* --- MOVING X/Y GANTRY & EXTRUDER HEAD (SYNCHRONIZED WITH PRINTING) --- */}
          <motion.g
            animate={{
              x: [-110, 110, -70, 70, -110],
              y: [0, -15, 10, -5, 0],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Horizontal X-Axis Gantry Beam */}
            <rect x="180" y="138" width="460" height="24" rx="5" fill="url(#gantryBeam)" stroke="#64748b" strokeWidth="1.5" />
            <line x1="180" y1="150" x2="640" y2="150" stroke="#0f172a" strokeWidth="2" />

            {/* Direct Drive Extruder Carriage Assembly */}
            <g transform="translate(372, 130)">
              {/* Stepper Motor Housing */}
              <rect x="0" y="0" width="76" height="52" rx="8" fill="url(#stepperMotor)" stroke="#475569" strokeWidth="2" />
              <rect x="12" y="8" width="52" height="36" rx="4" fill="#111827" />
              <circle cx="38" cy="26" r="14" fill="#090d12" stroke="#22d3ee" strokeWidth="1.5" />
              <circle cx="38" cy="26" r="5" fill="#22d3ee" />

              {/* Heatsink Fins */}
              <line x1="12" y1="46" x2="64" y2="46" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="12" y1="50" x2="64" y2="50" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Heater Block & Brass Nozzle */}
              <rect x="24" y="52" width="28" height="18" rx="3" fill="#ca8a04" stroke="#eab308" strokeWidth="1" />
              <polygon points="32,70 44,70 38,82" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />

              {/* Real-time Extrusion Heat Spark / Light Emission */}
              <circle cx="38" cy="82" r="6" fill="#ffffff" filter="url(#intenseGlow)" />

              {/* Part Cooling Fan Shroud (Realistic Air Duct) */}
              <path d="M12 55 L3 74 H24 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <path d="M64 55 L73 74 H52 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              <circle cx="15" cy="65" r="4" fill="#22d3ee" opacity="0.8" />
              <circle cx="61" cy="65" r="4" fill="#22d3ee" opacity="0.8" />
            </g>
          </motion.g>

          {/* Subtle Ambient Light Reflections on Glass Frame Edges */}
          <line x1="188" y1="115" x2="188" y2="495" stroke="#ffffff" strokeWidth="2" opacity="0.25" />
          <line x1="604" y1="115" x2="604" y2="495" stroke="#ffffff" strokeWidth="2" opacity="0.15" />
        </svg>
      </div>
    </motion.div>
  );
}
