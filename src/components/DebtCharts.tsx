 import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Scatter } from 'recharts';
 import { AnalysisResult } from '@/types/finance';
 
 interface DebtChartsProps {
   data: AnalysisResult;
 }
 
 const COLORS = ['hsl(217, 91%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(280, 65%, 60%)', 'hsl(45, 93%, 47%)', 'hsl(0, 72%, 51%)'];
 
 const DebtCharts = ({ data }: DebtChartsProps) => {
   // Prepare data for maturity distribution chart
   const yearData: Record<number, number> = {};
   data.instruments.forEach(inst => {
     yearData[inst.dueYear] = (yearData[inst.dueYear] || 0) + inst.amount;
   });
   
   const maturityData = Object.entries(yearData)
     .map(([year, amount]) => ({ year: parseInt(year), amount }))
     .sort((a, b) => a.year - b.year);
 
   // Prepare data for rate distribution
   const rateRanges = [
     { name: '< 2%', count: 0, total: 0 },
     { name: '2-3%', count: 0, total: 0 },
     { name: '3-4%', count: 0, total: 0 },
     { name: '4-5%', count: 0, total: 0 },
     { name: '> 5%', count: 0, total: 0 }
   ];
 
   data.instruments.forEach(inst => {
     const rate = inst.interestRate;
     if (rate < 2) { rateRanges[0].count++; rateRanges[0].total += inst.amount; }
     else if (rate < 3) { rateRanges[1].count++; rateRanges[1].total += inst.amount; }
     else if (rate < 4) { rateRanges[2].count++; rateRanges[2].total += inst.amount; }
     else if (rate < 5) { rateRanges[3].count++; rateRanges[3].total += inst.amount; }
     else { rateRanges[4].count++; rateRanges[4].total += inst.amount; }
   });
 
   // Rate vs Amount scatter-like data
   const rateAmountData = data.instruments.map(inst => ({
     name: inst.noteBond,
     rate: inst.interestRate,
     amount: inst.amount,
     year: inst.dueYear
   }));
 
  // Risk assessment data
  const riskData = [
    { metric: 'Concentration', value: Math.min(100, (yearData[data.peakYear] || 0) / data.totalDebt * 100 * 3) },
    { metric: 'Duration', value: Math.min(100, (data.maxMaturityYear - data.minMaturityYear) * 8) },
    { metric: 'Rate Risk', value: Math.min(100, data.weightedAvgRate * 20) },
    { metric: 'Liquidity', value: Math.max(20, 100 - data.instrumentCount * 4) },
    { metric: 'Diversity', value: Math.min(100, data.instrumentCount * 7) },
  ];

   const CustomTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
       return (
         <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
           <p className="text-foreground font-semibold">{label}</p>
           {payload.map((entry: any, index: number) => (
             <p key={index} className="text-muted-foreground text-sm">
               {entry.name}: ${entry.value}M
             </p>
           ))}
         </div>
       );
     }
     return null;
   };
 
   return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       {/* Maturity Distribution Bar Chart */}
       <motion.div
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
        className="glass-card glass-card-hover p-6"
       >
         <h3 className="text-lg font-semibold text-foreground mb-4">Debt Maturity Distribution</h3>
         <ResponsiveContainer width="100%" height={300}>
           <BarChart data={maturityData}>
             <XAxis 
               dataKey="year" 
               stroke="hsl(215, 20%, 55%)"
               tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
             />
             <YAxis 
               stroke="hsl(215, 20%, 55%)"
               tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
               tickFormatter={(value) => `$${value}M`}
             />
             <Tooltip content={<CustomTooltip />} />
             <Bar 
               dataKey="amount" 
               name="Principal"
               radius={[4, 4, 0, 0]}
             >
               {maturityData.map((entry, index) => (
                 <Cell 
                   key={`cell-${index}`} 
                   fill={COLORS[index % COLORS.length]}
                   opacity={0.9}
                 />
               ))}
             </Bar>
           </BarChart>
         </ResponsiveContainer>
       </motion.div>
 
       {/* Rate Distribution Pie Chart */}
       <motion.div
         initial={{ opacity: 0, x: 20 }}
         animate={{ opacity: 1, x: 0 }}
        className="glass-card glass-card-hover p-6"
       >
         <h3 className="text-lg font-semibold text-foreground mb-4">Interest Rate Distribution</h3>
         <ResponsiveContainer width="100%" height={300}>
           <PieChart>
             <Pie
               data={rateRanges.filter(r => r.count > 0)}
               cx="50%"
               cy="50%"
               innerRadius={60}
               outerRadius={100}
               paddingAngle={5}
               dataKey="total"
               nameKey="name"
               label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
               labelLine={{ stroke: 'hsl(215, 20%, 55%)' }}
             >
               {rateRanges.filter(r => r.count > 0).map((entry, index) => (
                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
               ))}
             </Pie>
             <Tooltip formatter={(value) => `$${value}M`} />
             <Legend />
           </PieChart>
         </ResponsiveContainer>
       </motion.div>
 
       {/* Cumulative Maturity Area Chart */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
        className="glass-card glass-card-hover p-6"
       >
        <h3 className="text-lg font-semibold text-foreground mb-4">Cumulative Maturity Profile</h3>
         <ResponsiveContainer width="100%" height={280}>
           <AreaChart data={maturityData.map((d, i, arr) => ({
             ...d,
             cumulative: arr.slice(0, i + 1).reduce((sum, item) => sum + item.amount, 0)
           }))}>
             <defs>
               <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.8}/>
                 <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.1}/>
               </linearGradient>
             </defs>
             <XAxis 
               dataKey="year" 
               stroke="hsl(215, 20%, 55%)"
               tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
             />
             <YAxis 
               stroke="hsl(215, 20%, 55%)"
               tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
               tickFormatter={(value) => `$${value}M`}
             />
             <Tooltip content={<CustomTooltip />} />
             <Area
               type="monotone"
               dataKey="cumulative"
               name="Cumulative"
               stroke="hsl(217, 91%, 60%)"
               fill="url(#colorAmount)"
               strokeWidth={2}
             />
             <Line
               type="monotone"
               dataKey="amount"
               name="Annual"
               stroke="hsl(160, 84%, 39%)"
               strokeWidth={2}
               dot={{ fill: 'hsl(160, 84%, 39%)', r: 4 }}
             />
             <Legend />
           </AreaChart>
         </ResponsiveContainer>
       </motion.div>

      {/* Risk Radar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card glass-card-hover p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Risk Assessment Radar</h3>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={riskData}>
            <PolarGrid stroke="hsl(215, 20%, 25%)" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
            />
            <Radar
              name="Risk Score"
              dataKey="value"
              stroke="hsl(280, 65%, 60%)"
              fill="hsl(280, 65%, 60%)"
              fillOpacity={0.4}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(0)}%`, 'Score']}
              contentStyle={{ 
                background: 'hsl(222, 47%, 8%)', 
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
     </div>
   );
 };
 
 export default DebtCharts;