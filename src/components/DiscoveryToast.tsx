import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';

export function DiscoveryToast() {
  const toast = useAppStore((s) => s.toastProject);
  const clearToast = useAppStore((s) => s.clearToast);
  const count = useAppStore((s) => s.discovered.size);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="discovery-toast"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          role="status"
        >
          <span className="discovery-toast__star">★</span>
          <div>
            <strong>{toast.name}</strong>
            <span>Découvert · {count}/6</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
