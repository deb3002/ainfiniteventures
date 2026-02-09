import { motion } from "framer-motion";

const nodes = [
  { x: 10, y: 20, r: 3, delay: 0 },
  { x: 25, y: 65, r: 4, delay: 0.5 },
  { x: 15, y: 80, r: 2.5, delay: 1.2 },
  { x: 40, y: 30, r: 3.5, delay: 0.3 },
  { x: 55, y: 75, r: 3, delay: 0.8 },
  { x: 70, y: 20, r: 4, delay: 0.1 },
  { x: 85, y: 55, r: 2.5, delay: 1.0 },
  { x: 90, y: 15, r: 3, delay: 0.6 },
  { x: 30, y: 45, r: 3.5, delay: 0.4 },
  { x: 60, y: 45, r: 2.5, delay: 0.9 },
  { x: 75, y: 70, r: 3, delay: 1.1 },
  { x: 50, y: 15, r: 4, delay: 0.2 },
  { x: 20, y: 40, r: 2, delay: 0.7 },
  { x: 80, y: 35, r: 3, delay: 1.3 },
];

// Build edges between nodes that are within a certain distance
const maxDist = 35;
const edges: { x1: number; y1: number; x2: number; y2: number; delay: number }[] = [];
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const dx = nodes[i].x - nodes[j].x;
    const dy = nodes[i].y - nodes[j].y;
    if (Math.sqrt(dx * dx + dy * dy) < maxDist) {
      edges.push({
        x1: nodes[i].x,
        y1: nodes[i].y,
        x2: nodes[j].x,
        y2: nodes[j].y,
        delay: (nodes[i].delay + nodes[j].delay) / 2,
      });
    }
  }
}

export const HeroAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-25"
      >
        {/* Edges */}
        {edges.map((edge, i) => (
          <motion.line
            key={`edge-${i}`}
            x1={`${edge.x1}`}
            y1={`${edge.y1}`}
            x2={`${edge.x2}`}
            y2={`${edge.y2}`}
            stroke="hsl(var(--accent))"
            strokeWidth="0.15"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{
              duration: 4,
              delay: edge.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={`node-${i}`}
            cx={`${node.x}`}
            cy={`${node.y}`}
            r={`${node.r}`}
            fill="hsl(var(--accent))"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              cy: [node.y, node.y - 3, node.y],
            }}
            transition={{
              duration: 5 + node.delay,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
