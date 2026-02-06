import { motion } from 'framer-motion';
import { TrendingUp, PieChart, FileText, AlertTriangle, Calendar, Percent } from 'lucide-react';

interface QuickActionsProps {
  onAction: (question: string) => void;
}

const QuickActions = ({ onAction }: QuickActionsProps) => {
  const actions = [
    { icon: TrendingUp, label: 'Total Debt', question: 'What is the total debt amount?', color: 'primary' },
    { icon: Percent, label: 'Avg Rate', question: 'What is the weighted average interest rate?', color: 'accent' },
    { icon: Calendar, label: 'Peak Year', question: 'Which year has the most debt maturing?', color: 'chart-3' },
    { icon: AlertTriangle, label: 'Risk Assessment', question: 'What is the refinancing risk assessment?', color: 'chart-4' },
    { icon: PieChart, label: 'Debt Profile', question: 'What is the debt maturity profile?', color: 'chart-5' },
    { icon: FileText, label: 'All Instruments', question: 'List all debt instruments', color: 'primary' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Analysis</h3>
      <div className="flex flex-wrap gap-2">
        {actions.map(({ icon: Icon, label, question, color }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(question)}
            className={`chip-action flex items-center gap-2 hover:border-${color}/50`}
          >
            <Icon className={`w-4 h-4 text-${color}`} />
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;