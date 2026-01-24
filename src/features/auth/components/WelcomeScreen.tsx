import { motion } from 'framer-motion';

interface WelcomeScreenProps {
    onEnter: () => void;
}

// 1. Simple Pink Flower (Top Left cluster style)
const PinkCluster = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        {/* Stems */}
        <path d="M50 100 Q 50 50 20 20" stroke="black" />
        <path d="M50 100 Q 50 60 50 20" stroke="black" />
        <path d="M50 100 Q 50 50 80 30" stroke="black" />
        {/* Flowers */}
        <circle cx="20" cy="20" r="8" fill="#FF4D8C" stroke="none" />
        <circle cx="50" cy="20" r="10" fill="#FF4D8C" stroke="none" />
        <circle cx="80" cy="30" r="6" fill="#FF4D8C" stroke="none" />
    </svg>
);

// 2. Beige Daisy (Center top)
const BeigeDaisy = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <g transform="translate(50,50)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot, i) => (
                <ellipse key={i} rx="6" ry="15" fill="#FAD1B0" transform={`rotate(${rot}) translate(0, -15)`} />
            ))}
            <circle r="5" fill="black" />
        </g>
    </svg>
);

// 3. Line Art Dandelion (Top Right)
const Dandelion = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 120" className={className} stroke="black" strokeWidth="1.5" fill="none">
        <path d="M50 120 Q 40 80 50 50" strokeWidth="2" />
        <circle cx="50" cy="40" r="20" strokeDasharray="2 4" />
        <line x1="50" y1="40" x2="50" y2="10" />
        <line x1="50" y1="40" x2="80" y2="40" />
        <line x1="50" y1="40" x2="20" y2="40" />
        <line x1="50" y1="40" x2="70" y2="20" />
        <line x1="50" y1="40" x2="30" y2="20" />
    </svg>
);

// 4. Red Tulip-ish (Right side)
const RedFlower = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <path d="M50 100 Q 60 50 80 30" stroke="black" strokeWidth="2" fill="none" />
        <path d="M80 30 C 60 30 60 10 80 0 C 100 10 100 30 80 30" fill="#FF4DA6" />
        <circle cx="90" cy="35" r="3" fill="#FF4DA6" />
    </svg>
);

// 5. Big Pink Daisy (Bottom Left/Right)
const BigPinkDaisy = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 120" className={className}>
        <path d="M50 120 Q 50 60 50 50" stroke="black" strokeWidth="2" fill="none" />
        <g transform="translate(50,50)">
            {[0, 72, 144, 216, 288].map((rot, i) => (
                <path
                    key={i}
                    d="M0 0 Q 10 -20 0 -35 Q -10 -20 0 0"
                    fill="#FF4D8C"
                    stroke="black"
                    strokeWidth="1"
                    transform={`rotate(${rot})`}
                />
            ))}
            <circle r="0" fill="white" />
        </g>
    </svg>
);

// 6. Scattered Petal/Leaf (Random)
const Leaf = ({ className, color = "#FAD1B0" }: { className?: string, color?: string }) => (
    <svg viewBox="0 0 50 50" className={className}>
        <path d="M0 50 Q 10 10 50 0 Q 20 20 0 50" fill={color} opacity="0.8" />
    </svg>
);


export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
    return (
        <motion.div
            className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden font-sans cursor-pointer"
            onClick={onEnter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* --- DECORATIVE ELEMENTS (Absolute Positioned) --- */}

            {/* Top Left */}
            <motion.div
                className="absolute top-[-20px] left-[-20px] w-48 h-48 opacity-90"
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            >
                <PinkCluster className="w-full h-full" />
            </motion.div>

            {/* Top Center-Left */}
            <motion.div
                className="absolute top-[15%] left-[15%] w-16 h-16 opacity-80"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
            >
                <BeigeDaisy className="w-full h-full" />
            </motion.div>

            {/* Top Right */}
            <motion.div
                className="absolute top-4 right-8 w-32 h-32 opacity-80"
                initial={{ rotate: 10 }}
                animate={{ rotate: 15 }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
            >
                <Dandelion className="w-full h-full" />
            </motion.div>

            {/* Middle Right */}
            <motion.div
                className="absolute top-[30%] right-[-10px] w-24 h-24"
            >
                <RedFlower className="w-full h-full" />
            </motion.div>


            {/* Bottom Left */}
            <motion.div
                className="absolute bottom-8 left-8 w-40 h-40"
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
            >
                <BigPinkDaisy className="w-full h-full" />
            </motion.div>

            {/* Bottom Center */}
            <motion.div
                className="absolute bottom-[15%] left-[40%] w-12 h-12"
            >
                <Leaf className="w-full h-full" color="#1F2937" /> {/* Blackish leaf */}
            </motion.div>

            {/* Bottom Right */}
            <motion.div
                className="absolute bottom-12 right-12 w-32 h-32"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
            >
                <BigPinkDaisy className="w-full h-full" />
                {/* Override color prop logic if component supported it, but relying on default pink for now as per ref matches close enough */}
            </motion.div>

            {/* Random small bits */}
            <motion.div className="absolute top-[40%] left-[8%] w-8 h-8"><BeigeDaisy className="w-full h-full" /></motion.div>
            <motion.div className="absolute top-[60%] right-[15%] w-12 h-12"><Leaf className="w-full h-full" /></motion.div>


            {/* --- MAIN CONTENT --- */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10"
            >
                <div className="relative w-[300px] h-[120px] md:w-[500px] md:h-[200px]">
                    <svg viewBox="0 0 300 120" className="w-full h-full">
                        <defs>
                            <linearGradient id="hello-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="300" y2="0">
                                <stop offset="0%" stopColor="#FFC800" />
                                <stop offset="50%" stopColor="#F0F" />
                                <stop offset="100%" stopColor="#00DA72" />
                                <animateTransform
                                    attributeName="gradientTransform"
                                    type="rotate"
                                    from="0 150 60"
                                    to="360 150 60"
                                    dur="8s"
                                    repeatCount="indefinite"
                                />
                            </linearGradient>
                        </defs>
                        <text
                            x="50%"
                            y="70%"
                            textAnchor="middle"
                            className="hello-text text-6xl md:text-8xl font-black tracking-tighter"
                            style={{
                                fill: 'none',
                                stroke: 'url(#hello-grad)',
                                strokeWidth: '3px',
                                fontFamily: 'var(--font-geist-sans), sans-serif',
                                fontSize: '80px',
                                fontWeight: 900
                            }}
                        >
                            Hello,
                        </text>
                    </svg>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .hello-text {
                        stroke-dasharray: 400;
                        animation: strokeAnim 4s linear infinite alternate;
                    }
                    
                    @keyframes strokeAnim {
                        0% {
                            stroke-dashoffset: 400;
                            stroke-width: 1px;
                        }
                        50% {
                            stroke-dashoffset: 0;
                            stroke-width: 3px;
                        }
                        100% {
                            stroke-dashoffset: 400;
                            stroke-width: 1px;
                        }
                    }
                    `
                }} />
            </motion.div>

        </motion.div>
    );
}
