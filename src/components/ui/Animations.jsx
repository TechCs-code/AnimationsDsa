//import { motion } from 'framer-motion';

export const ArrayAnimation = () => {
  return (
    <motion.div 
      className="flex gap-2 justify-center items-center h-32 bg-black/5 rounded-xl p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[1, 3, 5, 7, 9, 11, 13].map((num, index) => (
        <motion.div
          key={index}
          className="w-12 h-12 bg-primary/80 rounded-lg flex items-center justify-center text-white font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {num}
        </motion.div>
      ))}
    </motion.div>
  );
};

//export const InteractiveCodeBlock = ({ code }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-black/90 p-4">
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary animate-gradient"></div>
      <pre className="text-gray-100 font-mono text-sm overflow-x-auto">
        {code}
      </pre>
    </div>
  );
};