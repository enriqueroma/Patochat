import { cn } from "@/src/lib/utils";

interface DuckIconProps {
  color: string;
  className?: string;
  size?: number;
}

export function DuckIcon({ color, className, size = 24 }: DuckIconProps) {
  // Pixel Art Matrix (12x12)
  // 0: transparent, 1: body yellow, 2: beak orange, 3: eye black, 4: cap color
  const matrix = [
    [0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0],
    [0, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0],
    [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
    [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], // Brim
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1],
    [0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const colors: Record<number, string> = {
    0: "transparent",
    1: "#facc15", // yellow-400
    2: "#f97316", // orange-500
    3: "#000000", // black
    4: color      // dynamic cap color
  };

  return (
    <div 
      className={cn("grid grid-cols-12 gap-0", className)}
      style={{ 
        width: size, 
        height: size,
        gridTemplateRows: "repeat(12, 1fr)"
      }}
    >
      {matrix.flat().map((pixel, i) => (
        <div 
          key={i} 
          style={{ backgroundColor: colors[pixel] }} 
          className="w-full h-full"
        />
      ))}
    </div>
  );
}
