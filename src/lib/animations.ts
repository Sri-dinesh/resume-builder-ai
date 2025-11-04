// Animation variants for Framer Motion - Optimized for performance
export const fadeIn = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Reduced from 0.5
      delay: custom * 0.08, // Reduced from 0.1
      ease: "easeOut", // More performant easing
    },
  }),
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2, // Reduced from 0.3
      ease: "easeIn",
    },
  },
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08, // Reduced from 0.1
      delayChildren: 0.05,
    },
  },
};

export const scaleUp = {
  initial: {
    scale: 0.95,
    opacity: 0,
  },
  animate: (custom = 0) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3, // Changed from spring to duration for better performance
      delay: custom * 0.08,
      ease: "easeOut",
    },
  }),
  hover: {
    scale: 1.03, // Reduced from 1.05
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const slideInFromLeft = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: (custom = 0) => ({
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: custom * 0.1,
    },
  }),
};

export const slideInFromRight = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: (custom = 0) => ({
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: custom * 0.1,
    },
  }),
};

export const slideInFromBottom = {
  initial: {
    y: 100,
    opacity: 0,
  },
  animate: (custom = 0) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      delay: custom * 0.1,
    },
  }),
};

export const buttonHover = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

export const cardHover = {
  initial: {
    y: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  hover: {
    y: -5,
    boxShadow:
      "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

export const pulse = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
    },
  },
};

export const rotateIcon = {
  initial: {
    rotate: 0,
  },
  hover: {
    rotate: [0, -10, 10, -10, 0],
    transition: {
      duration: 0.5,
    },
  },
};

export const lineDrawing = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
};
