/**
 * Custom SVG Gauge / Speedometer chart component.
 * Renders a half-circle gauge with a colored arc and center value.
 */
export default function GaugeChart({
  value = 0,
  max = 100,
  label = '',
  formatValue,
  size = 180,
  color = '#1677ff',
  bgColor = '#f0f0f0',
  strokeWidth = 14,
}) {
  const pct = Math.min(value / max, 1);
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2 + 10; // push down a bit for half-circle layout

  // Arc goes from 180° to 0° (left to right, bottom half-circle)
  const startAngle = Math.PI; // 180°
  const endAngle = 0;        // 0°
  const sweepAngle = startAngle - (startAngle - endAngle) * pct;

  const arcStartX = cx + radius * Math.cos(startAngle);
  const arcStartY = cy - radius * Math.sin(startAngle);
  const arcEndX = cx + radius * Math.cos(endAngle);
  const arcEndY = cy - radius * Math.sin(endAngle);
  const valueEndX = cx + radius * Math.cos(sweepAngle);
  const valueEndY = cy - radius * Math.sin(sweepAngle);

  const largeArcBg = 1; // always > 180 for the full half
  const largeArcValue = pct > 0.5 ? 1 : 0;

  const bgPath = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 ${largeArcBg} 1 ${arcEndX} ${arcEndY}`;
  const valuePath = `M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 ${largeArcValue} 1 ${valueEndX} ${valueEndY}`;

  const displayValue = formatValue ? formatValue(value) : value.toLocaleString('ru-RU');

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Background arc */}
        <path
          d={bgPath}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
        />
        {/* Value arc */}
        {pct > 0 && (
          <path
            d={valuePath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
        )}
        {/* Center text – value */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 18, fontWeight: 600, fill: '#000000e0' }}
        >
          {displayValue}
        </text>
        {/* Percentage */}
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 11, fill: '#8c8c8c' }}
        >
          {Math.round(pct * 100)}%
        </text>
      </svg>
      {label && (
        <div style={{ marginTop: -4, fontSize: 12, color: '#8c8c8c', fontWeight: 400 }}>
          {label}
        </div>
      )}
    </div>
  );
}
