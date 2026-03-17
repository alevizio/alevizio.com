import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import svgPaths from "../../imports/svg-ectekmh7x3";
import imgImage4 from "figma:asset/9bedae1a0a866d804b6b66159248f7938c255179.png";

export default function AnimatedLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [mouseX, mouseY]);

  return (
    <div className="bg-[#dedbd1] relative size-full" data-name="alevizio.com">
      <div className="absolute content-stretch flex flex-col gap-[140px] items-start left-0 p-[140px] top-0 w-[1440px]">
        {/* Animated Logo */}
        <motion.div
          className="h-[53px] relative shrink-0 w-[80.116px]"
          data-name="Union"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80.1162 53">
            <path d={svgPaths.p3e2d6e80} fill="var(--fill-0, #1E1E1E)" id="Union" />
          </svg>
        </motion.div>

        {/* Animated Text Content */}
        <div className="content-stretch flex flex-col font-['Instrument_Sans:Regular',sans-serif] font-normal gap-[16px] items-start leading-[normal] relative shrink-0 text-black w-[674px]">
          <motion.p
            className="min-w-full relative shrink-0 text-[52px] w-[min-content]"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            a relentless mind shaping product, brand & interaction
          </motion.p>
          <motion.p
            className="relative shrink-0 text-[18px] w-[625px]"
            style={{ fontVariationSettings: "'wdth' 100" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            I design products, identities, and interactions that bring clarity to complex ideas — from early concepts to polished systems used by real people.
          </motion.p>
        </div>
      </div>

      {/* Animated Portrait Image */}
      <motion.div
        ref={containerRef}
        className="absolute h-[861px] right-0 top-0 w-[490px]"
        data-name="image 4"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          perspective: 1000,
        }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            rotateX,
            rotateY,
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <img alt="" className="absolute h-[100.1%] left-[-40.65%] max-w-none top-[-0.05%] w-[140.65%]" src={imgImage4} />
        </motion.div>
      </motion.div>
    </div>
  );
}