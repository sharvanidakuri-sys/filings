 import { motion } from 'framer-motion';
import { DollarSign, Percent, Calendar, TrendingUp, BarChart3, Clock, Download } from 'lucide-react';
 import { AnalysisResult } from '@/types/finance';
import { Button } from '@/components/ui/button';
 
 interface MetricsGridProps {
   data: AnalysisResult;
 }
 
 const MetricsGrid = ({ data }: MetricsGridProps) => {
  const handleDownloadCSV = () => {
    const headers = ['Instrument', 'Interest Rate (%)', 'Due Year', 'Amount ($M)', 'Entity', 'Annual Interest ($M)'];
    const rows = data.instruments.map(i => [
      i.noteBond,
      i.interestRate,
      i.dueYear,
      i.amount,
      i.relatedEntity,
      i.annualInterest
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.companyName.replace(/\s+/g, '_')}_debt_analysis.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.companyName.replace(/\s+/g, '_')}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

   const metrics = [
     {
       label: 'Total Debt',
       value: data.totalDebtFormatted,
       icon: DollarSign,
       color: 'primary',
       description: 'Outstanding principal'
     },
     {
       label: 'Weighted Avg Rate',
       value: `${data.weightedAvgRate}%`,
       icon: Percent,
       color: 'accent',
       description: 'Cost of debt'
     },
     {
       label: 'Instruments',
       value: data.instrumentCount.toString(),
       icon: BarChart3,
       color: 'chart-3',
       description: 'Debt obligations'
     },
     {
       label: 'Peak Year',
       value: data.peakYear.toString(),
       icon: Calendar,
       color: 'chart-4',
       description: 'Highest maturity'
     },
     {
       label: 'Maturity Range',
       value: `${data.maxMaturityYear - data.minMaturityYear}y`,
       icon: Clock,
       color: 'chart-5',
       description: `${data.minMaturityYear} - ${data.maxMaturityYear}`
     },
     {
       label: 'Simple Avg Rate',
       value: `${data.simpleAvgRate}%`,
       icon: TrendingUp,
       color: 'muted',
       description: 'Unweighted average'
     }
   ];
 
   return (
    <div className="space-y-4 mb-8">
      {/* Download Actions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Key Metrics</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownloadCSV} className="gap-2 glass-card-hover">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadJSON} className="gap-2 glass-card-hover">
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card glass-card-hover p-4 metric-shine"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${metric.color}/20`}>
                <metric.icon className={`w-4 h-4 text-${metric.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-xs text-muted-foreground/70 mt-1">{metric.description}</p>
          </motion.div>
        ))}
      </div>
     </div>
   );
 };
 
 export default MetricsGrid;