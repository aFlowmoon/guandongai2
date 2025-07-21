import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function Announcement({ announcement }: { announcement: {
  id: string;
  title: string;
  content: string;
  date: string;
}}) {
  const [expanded, setExpanded] = useState(false);

  const formattedDate = format(new Date(announcement.date), 'PPP', { locale: zhCN });

  return (
    <motion.div 
      className={cn(
        "p-3 rounded-lg bg-white",
        "shadow-sm cursor-pointer",
        "border border-blue-100",
        "transition-all hover:border-blue-300"
      )}
      onClick={() => setExpanded(!expanded)}
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-blue-800">{announcement.title}</h3>
        <span className="text-xs text-blue-500">{formattedDate}</span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.p
            className="mt-2 text-sm text-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {announcement.content}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}