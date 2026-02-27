import { motion } from 'framer-motion';

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = ({
  subtitle,
  title,
  description,
  align = 'center',
}: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''} mb-12`}
    >
      {subtitle && (
        <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}
    </motion.div>
  );
};
