import React from 'react';

interface ClinicalXRaySvgProps {
  type?: 'pneumothorax' | 'pneumonia' | 'normal' | 'cardiomegaly' | 'fracture';
  className?: string;
  showOverlay?: boolean;
}

export const ClinicalXRaySvg: React.FC<ClinicalXRaySvgProps> = ({
  type = 'normal',
  className = 'w-full h-full',
  showOverlay = false,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ userSelect: 'none' }}
    >
      <defs>
        {/* Soft tissue gradient */}
        <radialGradient id="lungFieldGrad" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#0B101D" />
          <stop offset="60%" stopColor="#151E32" />
          <stop offset="100%" stopColor="#05070C" />
        </radialGradient>

        {/* Bone density gradient (Ribs & Spine) */}
        <linearGradient id="boneDensity" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C9D6E4" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#8A9BB3" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#55667D" stopOpacity="0.65" />
        </linearGradient>

        {/* Dense clavicle & spine */}
        <linearGradient id="denseBone" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A8B9CD" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#E2EDF8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#A8B9CD" stopOpacity="0.75" />
        </linearGradient>

        {/* Cardiac & Mediastinal silhouette */}
        <radialGradient id="cardiacDensity" cx="42%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#E8EFF8" stopOpacity="0.88" />
          <stop offset="70%" stopColor="#B3C4D8" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#6C809A" stopOpacity="0.5" />
        </radialGradient>

        {/* Pneumonia opacity */}
        <radialGradient id="pneumoniaInfiltrate" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E2EDF8" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#BCCCDC" stopOpacity="0.65" />
          <stop offset="80%" stopColor="#8DA3B8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0B101D" stopOpacity="0" />
        </radialGradient>

        {/* Vignette background */}
        <radialGradient id="pacsVignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#0A0E17" />
          <stop offset="85%" stopColor="#020306" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>

      {/* 1. Deep PACS Canvas Background */}
      <rect width="500" height="500" fill="url(#pacsVignette)" />

      {/* DICOM Calibration Marks & Orientation */}
      <g stroke="#334155" strokeWidth="0.5" opacity="0.4">
        <line x1="250" y1="10" x2="250" y2="25" />
        <line x1="250" y1="475" x2="250" y2="490" />
        <line x1="10" y1="250" x2="25" y2="250" />
        <line x1="475" y1="250" x2="490" y2="250" />
      </g>
      <text x="35" y="45" fill="#64748B" fontSize="14" fontFamily="monospace" fontWeight="bold">R</text>
      <text x="455" y="45" fill="#64748B" fontSize="14" fontFamily="monospace" fontWeight="bold">L</text>
      <text x="35" y="70" fill="#475569" fontSize="10" fontFamily="monospace">PA ERECT</text>

      {/* 2. Thoracic Cage & Soft Tissue Outline */}
      <path
        d="M 120 70 Q 250 50 380 70 C 440 100 460 220 445 420 C 400 460 300 470 250 470 C 200 470 100 460 55 420 C 40 220 60 100 120 70 Z"
        fill="url(#lungFieldGrad)"
        stroke="#273347"
        strokeWidth="1.5"
      />

      {/* 3. Central Spine & Vertebral Column (Radio-opaque) */}
      <g opacity="0.6">
        {[80, 110, 140, 170, 200, 230, 260, 290, 320, 350, 380, 410].map((y, i) => (
          <rect
            key={i}
            x="236"
            y={y}
            width="28"
            height="22"
            rx="4"
            fill="url(#denseBone)"
            stroke="#65768D"
            strokeWidth="0.5"
          />
        ))}
        {/* Spinous processes */}
        {[95, 125, 155, 185, 215, 245, 275, 305, 335, 365, 395].map((y, i) => (
          <circle key={i} cx="250" cy={y} r="3" fill="#E8EFF8" opacity="0.7" />
        ))}
      </g>

      {/* 4. Clavicles (Dense bone arches) */}
      <path
        d="M 235 110 C 190 100 130 115 80 135 C 75 140 85 146 135 125 C 185 115 230 120 235 110 Z"
        fill="url(#denseBone)"
      />
      <path
        d="M 265 110 C 310 100 370 115 420 135 C 425 140 415 146 365 125 C 315 115 270 120 265 110 Z"
        fill="url(#denseBone)"
      />

      {/* 5. Posterior & Anterior Rib Arches */}
      {/* Right Ribs */}
      <g fill="none" stroke="url(#boneDensity)" strokeWidth="6" strokeLinecap="round" opacity="0.55">
        <path d="M 240 140 Q 150 150 90 200" />
        <path d="M 240 170 Q 140 180 80 240" />
        <path d="M 240 200 Q 130 220 75 280" />
        <path d="M 240 230 Q 120 260 75 320" />
        <path d="M 240 260 Q 120 300 78 360" />
        <path d="M 240 295 Q 120 340 85 400" />
        <path d="M 240 330 Q 130 380 100 430" />
      </g>
      {/* Left Ribs */}
      <g fill="none" stroke="url(#boneDensity)" strokeWidth="6" strokeLinecap="round" opacity="0.55">
        <path d="M 260 140 Q 350 150 410 200" />
        <path d="M 260 170 Q 360 180 420 240" />
        <path d="M 260 200 Q 370 220 425 280" />
        <path d="M 260 230 Q 380 260 425 320" />
        <path d="M 260 260 Q 380 300 422 360" />
        <path d="M 260 295 Q 380 340 415 400" />
        <path d="M 260 330 Q 370 380 400 430" />
      </g>

      {/* 6. Mediastinal Vascular Tree (Hilar markings) */}
      <g stroke="#7E93AC" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" fill="none">
        {/* Right Hilum */}
        <path d="M 235 210 Q 195 215 165 240" />
        <path d="M 235 220 Q 185 245 155 280" />
        <path d="M 235 230 Q 190 270 175 320" />
        {/* Left Hilum */}
        <path d="M 265 200 Q 305 205 335 230" />
        <path d="M 265 210 Q 315 235 345 270" />
        <path d="M 265 220 Q 310 260 325 310" />
      </g>

      {/* 7. Cardiac Silhouette (Heart & Aortic Knob) */}
      {/* Normal or Mediastinal Shift depending on condition */}
      {type === 'pneumothorax' ? (
        /* Tension Pneumothorax: Mediastinum shifted to the LEFT */
        <g fill="url(#cardiacDensity)">
          {/* Aortic Arch */}
          <path d="M 250 150 Q 285 155 280 185 Q 260 195 250 200 Z" />
          {/* Shifted Heart Contour */}
          <path
            d="M 250 200 C 275 220 370 260 355 350 C 340 410 290 425 240 425 C 220 425 220 380 230 330 C 235 280 245 220 250 200 Z"
            stroke="#9EB3CB"
            strokeWidth="0.8"
          />
        </g>
      ) : type === 'cardiomegaly' ? (
        /* Enlarged Heart CTR > 0.55 */
        <g fill="url(#cardiacDensity)">
          <path d="M 250 150 Q 280 155 275 185 Q 255 195 250 200 Z" />
          <path
            d="M 250 200 C 285 220 380 260 375 365 C 370 435 280 440 215 440 C 150 440 160 380 185 330 C 205 280 245 220 250 200 Z"
            stroke="#9EB3CB"
            strokeWidth="0.8"
          />
        </g>
      ) : (
        /* Normal Cardiac Silhouette (CTR ~ 0.45) */
        <g fill="url(#cardiacDensity)">
          {/* Aortic knob */}
          <path d="M 250 150 Q 275 155 270 185 Q 255 195 250 200 Z" />
          {/* Heart contour */}
          <path
            d="M 250 200 C 270 220 345 260 335 350 C 325 410 270 425 225 425 C 185 425 190 380 205 330 C 215 280 245 220 250 200 Z"
            stroke="#9EB3CB"
            strokeWidth="0.8"
          />
        </g>
      )}

      {/* 8. Hemidiaphragms & Costophrenic Angles */}
      <g fill="#A9BDD4" opacity="0.65">
        {/* Right Diaphragm */}
        <path d="M 60 420 Q 150 365 240 415 L 240 470 L 60 470 Z" />
        {/* Left Diaphragm */}
        <path d="M 240 415 Q 330 380 435 425 L 435 470 L 240 470 Z" />
      </g>
      {/* Gastric Air Bubble (Left Hemidiaphragm Base) */}
      <ellipse cx="320" cy="440" rx="30" ry="14" fill="#0A0F1D" stroke="#334155" strokeWidth="1" />

      {/* 9. PATHOLOGY SPECIFIC VISUALIZATIONS */}
      {type === 'pneumothorax' && (
        <g>
          {/* Retracted Visceral Pleural Line in Right Apex */}
          <path
            d="M 125 125 C 130 190 145 260 170 330"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="2"
            strokeDasharray="6 3"
            opacity="0.9"
          />
          {/* Avascular Peripheral Zone (completely hyperlucent / dark air) */}
          <path
            d="M 120 70 Q 180 60 220 85 L 125 125 C 130 190 145 260 170 330 L 75 320 Q 60 200 120 70 Z"
            fill="#020306"
            opacity="0.92"
          />
          <text
            x="85"
            y="170"
            fill="#F87171"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            ▲ PLEURAL LINE
          </text>
          <line x1="110" y1="175" x2="132" y2="195" stroke="#F87171" strokeWidth="1.5" />
        </g>
      )}

      {type === 'pneumonia' && (
        <g>
          {/* Alveolar Infiltrate & Consolidation in Right Basilar Field */}
          <ellipse cx="160" cy="325" rx="55" ry="42" fill="url(#pneumoniaInfiltrate)" />
          {/* Air Bronchogram lines */}
          <g stroke="#090E1A" strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
            <line x1="145" y1="310" x2="175" y2="335" />
            <line x1="160" y1="325" x2="180" y2="345" />
          </g>
          <text
            x="95"
            y="285"
            fill="#FBBF24"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
            letterSpacing="1"
          >
            ◆ CONSOLIDATION
          </text>
        </g>
      )}
    </svg>
  );
};
