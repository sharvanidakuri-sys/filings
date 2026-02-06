import { motion } from 'framer-motion';
import {
  Layers,
  HelpCircle,
  Building2,
  Database,
  BarChart,
  FileText,
  Globe
} from 'lucide-react';
import { suggestedQuestions } from '@/lib/mockData';

interface SidebarProps {
  onQuestionClick: (question: string) => void;
}

const Sidebar = ({ onQuestionClick }: SidebarProps) => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 flex-shrink-0 glass-card border-r border-border p-6 overflow-y-auto hidden lg:block"
    >
      <div className="space-y-8">

        {/* Live Data Status */}
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-accent/10 border border-accent/30">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-accent">
            Live Data Connected
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            Real-time
          </span>
        </div>

        {/* Project Info */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Financial Edge
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A financial research platform designed to explore SEC filings,
            company disclosures, and debt instruments with clear insights.
          </p>
        </div>

        {/* Platform Capabilities */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Platform Capabilities
          </h3>

          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              { icon: Building2, text: 'Company & Issuer Overview' },
              { icon: FileText, text: 'SEC Filings Review (10-K, 10-Q)' },
              { icon: Database, text: 'Structured Financial Data' },
              { icon: BarChart, text: 'Charts & Trend Analysis' },
              { icon: Globe, text: 'Live Market-Linked Updates' },
              { icon: HelpCircle, text: 'Question & Answer Insights' }
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 py-1">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Questions */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Quick Questions
          </h3>

          <div className="space-y-2">
            {suggestedQuestions.slice(0, 8).map((question) => (
              <button
                key={question}
                onClick={() => onQuestionClick(question)}
                className="w-full text-left px-3 py-2.5 rounded-xl
                bg-secondary/30 hover:bg-primary/10
                text-sm text-muted-foreground hover:text-foreground
                transition-all border border-transparent hover:border-primary/30"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

      </div>
    </motion.aside>
  );
};

export default Sidebar;
