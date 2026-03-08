import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Volume2, Volume1, Volume } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(() => {
        const saved = localStorage.getItem('bg-music-playing');
        return saved !== null ? saved === 'true' : true;
    });

    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('bg-music-volume');
        return saved !== null ? parseFloat(saved) : 0.05;
    });

    const [showVolume, setShowVolume] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Save states to localStorage when they change
    useEffect(() => {
        localStorage.setItem('bg-music-playing', isPlaying.toString());
    }, [isPlaying]);

    useEffect(() => {
        localStorage.setItem('bg-music-volume', volume.toString());
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        // Handle initial playback based on saved state
        if (audioRef.current && isPlaying) {
            const playAudio = async () => {
                try {
                    await audioRef.current?.play();
                } catch (error) {
                    console.log("Autoplay blocked or interupted:", error);
                    setIsPlaying(false); // Update UI to reflect it's not actually playing
                }
            };
            playAudio();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Show tooltip on mount for 3-5 seconds
    useEffect(() => {
        const delay = setTimeout(() => {
            setShowTooltip(true);
            tooltipTimerRef.current = setTimeout(() => {
                setShowTooltip(false);
            }, 4000);
        }, 1500);
        return () => {
            clearTimeout(delay);
            if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        };
    }, []);

    useEffect(() => {
        // Handle clicks outside to close volume on mobile
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowVolume(false);
            }
        };

        // Close volume on scroll (especially important for mobile)
        const handleScroll = () => {
            if (showVolume) setShowVolume(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showVolume]);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(console.error);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleVolume = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowVolume(!showVolume);
    };

    return (
        <div
            ref={containerRef}
            className="fixed bottom-6 right-6 z-[60] flex items-center flex-row-reverse gap-3"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
        >
            <audio
                ref={audioRef}
                src="/AASTAN HEI MASTERD.mp3"
                loop
            />

            <button
                onClick={togglePlay}
                onDoubleClick={toggleVolume} // Desktop shortcut
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative border border-gold/20 touch-manipulation",
                    isPlaying ? "bg-gold text-[hsl(145,45%,22%)] shadow-gold/20 animate-heartbeat" : "bg-[hsl(145,45%,22%)] text-[hsl(42,30%,96%)] animate-[heartbeat_4s_ease-in-out_infinite]"
                )}
                aria-label={isPlaying ? "Pause music" : "Play music"}
            >
                {isPlaying && (
                    <>
                        <span className="absolute inset-0 rounded-full bg-gold/60 animate-ripple" />
                        <span className="absolute inset-0 rounded-full bg-gold/40 animate-ripple [animation-delay:1s]" />
                        <span className="absolute inset-0 rounded-full bg-gold/20 animate-ripple [animation-delay:2s]" />
                    </>
                )}

                <div className={cn(
                    "absolute inset-0 border-2 border-gold/10 rounded-full scale-90",
                    isPlaying && "animate-[spin_4s_linear_infinite]"
                )} />

                <div className="relative z-10 scale-110">
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 ml-1 text-gold fill-current" />}
                </div>

                {isPlaying && (
                    <div className="absolute inset-0 pointer-events-none">
                        <motion.span
                            animate={{ y: [-5, -25], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute top-2 right-2 text-[10px]"
                        >
                            ♪
                        </motion.span>
                        <motion.span
                            animate={{ y: [-5, -30], opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                            className="absolute top-1 left-3 text-[10px]"
                        >
                            ♫
                        </motion.span>
                    </div>
                )}
            </button>

            {/* Play Qasida tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="absolute bottom-[calc(100%+12px)] right-0 whitespace-nowrap bg-background/95 backdrop-blur-xl border border-gold/30 text-foreground text-sm font-medium px-4 py-2.5 rounded-xl shadow-[0_4px_20px_-4px_hsl(var(--gold)/0.3)] pointer-events-none"
                    >
                        <span className="flex items-center gap-2">
                            <Music className="w-4 h-4 text-gold" />
                            <span>Play Qasida ♪</span>
                        </span>
                        {/* Arrow */}
                        <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-background/95 border-r border-b border-gold/30 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manual toggle for mobile volume on small screens */}
            <button
                className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-md border border-gold/20 flex lg:hidden items-center justify-center text-gold"
                onClick={toggleVolume}
            >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <AnimatePresence>
                {showVolume && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 'auto' }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        className="bg-background/90 backdrop-blur-xl border border-gold/30 rounded-full px-5 py-3 shadow-2xl flex items-center gap-4 overflow-hidden"
                    >
                        <div className="flex items-center gap-2">
                            {volume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> :
                                volume < 0.5 ? <Volume1 className="w-4 h-4 text-gold" /> :
                                    <Volume2 className="w-4 h-4 text-gold" />}
                            <span className="text-[10px] font-bold text-gold/80 min-w-[25px] tabular-nums">
                                {Math.round(volume * 100)}%
                            </span>
                        </div>

                        <Slider
                            value={[volume]}
                            max={1}
                            step={0.01}
                            onValueChange={(val) => setVolume(val[0])}
                            className="w-24 cursor-pointer"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const VolumeX = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 4.702a.705.705 0 0 0-1.203-.498L5.414 8.586a1 1 0 0 1-.707.293H2a1 1 0 0 0-1 1v4.242a1 1 0 0 0 1 1h2.707a1 1 0 0 1 .707.293l4.383 4.382A.705.705 0 0 0 11 19.298z" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>
);

export default BackgroundMusic;
