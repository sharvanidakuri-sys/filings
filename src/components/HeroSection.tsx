import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-chart-3/5 blur-3xl" />

      <div className="container relative z-10 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            <span className="text-foreground">Financial</span>
            <span className="text-gradient text-neon ml-3">Edge</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            A financial analysis platform built to review official SEC filings,
            organize debt-related information, and present clear insights
            through structured reports and visual summaries.
          </p>

          {/* Feature boxes – HUMAN, NO AI WORDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-14"
          >
            <div className="glass-card glass-card-hover p-6 text-center">
              <p className="text-base font-semibold text-foreground mb-1">
                Smart Financial Analysis
              </p>
              <p className="text-sm text-muted-foreground">
                Automatically reviews financial data to highlight important trends
                and observations
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 text-center">
              <p className="text-base font-semibold text-foreground mb-1">
                Official SEC Filing Data
              </p>
              <p className="text-sm text-muted-foreground">
                Works with verified EDGAR filings such as 10-K and 10-Q reports
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 text-center">
              <p className="text-base font-semibold text-foreground mb-1">
                Reports & Visual Summaries
              </p>
              <p className="text-sm text-muted-foreground">
                Converts complex filing data into readable tables, charts,
                and summaries
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-14"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10K+</p>
              <p className="text-xs text-muted-foreground">
                Companies Reviewed
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-accent">$2T+</p>
              <p className="text-xs text-muted-foreground">
                Financial Records Processed
              </p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-chart-3">99.9%</p>
              <p className="text-xs text-muted-foreground">
                Data Accuracy
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
