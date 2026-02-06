 import { motion } from 'framer-motion';
import { ArrowUpDown, Download, ExternalLink, Search } from 'lucide-react';
 import { AnalysisResult } from '@/types/finance';
 import { useState } from 'react';
import { Input } from '@/components/ui/input';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { Button } from '@/components/ui/button';
 
 interface DataTableProps {
   data: AnalysisResult;
 }
 
 type SortField = 'noteBond' | 'interestRate' | 'dueYear' | 'amount';
 type SortDirection = 'asc' | 'desc';
 
 const DataTable = ({ data }: DataTableProps) => {
   const [sortField, setSortField] = useState<SortField>('dueYear');
   const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [search, setSearch] = useState('');
 
   const handleSort = (field: SortField) => {
     if (sortField === field) {
       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
     } else {
       setSortField(field);
       setSortDirection('asc');
     }
   };
 
  const filteredInstruments = data.instruments.filter(inst =>
    inst.noteBond.toLowerCase().includes(search.toLowerCase()) ||
    inst.relatedEntity.toLowerCase().includes(search.toLowerCase())
  );

  const sortedInstruments = [...filteredInstruments].sort((a, b) => {
     const modifier = sortDirection === 'asc' ? 1 : -1;
     if (sortField === 'noteBond') return a.noteBond.localeCompare(b.noteBond) * modifier;
     if (sortField === 'interestRate') return (a.interestRate - b.interestRate) * modifier;
     if (sortField === 'dueYear') return (a.dueYear - b.dueYear) * modifier;
     if (sortField === 'amount') return (a.amount - b.amount) * modifier;
     return 0;
   });
 
  const handleExport = () => {
    const headers = ['Instrument', 'Interest Rate (%)', 'Due Year', 'Amount ($M)', 'Annual Interest ($M)', 'Entity'];
    const rows = sortedInstruments.map(i => [
      i.noteBond, i.interestRate, i.dueYear, i.amount, i.annualInterest, i.relatedEntity
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.companyName.replace(/\s+/g, '_')}_debt_instruments.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

   const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
     <button
       onClick={() => handleSort(field)}
       className="flex items-center gap-2 hover:text-primary transition-colors"
     >
       {label}
       <ArrowUpDown className={`w-4 h-4 ${sortField === field ? 'text-primary' : 'text-muted-foreground'}`} />
     </button>
   );
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
     >
      <div className="p-4 border-b border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Debt Instruments
          </h3>
          <p className="text-sm text-muted-foreground">{sortedInstruments.length} of {data.instrumentCount} records</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search instruments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/30 border-border rounded-xl h-9"
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 glass-card-hover">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
       </div>
 
       <div className="overflow-x-auto">
         <Table>
           <TableHeader>
             <TableRow className="bg-secondary/30 hover:bg-secondary/30">
               <TableHead className="text-foreground font-semibold">
                 <SortHeader field="noteBond" label="Note / Bond" />
               </TableHead>
               <TableHead className="text-foreground font-semibold">
                 <SortHeader field="interestRate" label="Interest Rate" />
               </TableHead>
               <TableHead className="text-foreground font-semibold">
                 <SortHeader field="dueYear" label="Due Year" />
               </TableHead>
               <TableHead className="text-foreground font-semibold">
                 <SortHeader field="amount" label="Principal" />
               </TableHead>
               <TableHead className="text-foreground font-semibold">Annual Interest</TableHead>
               <TableHead className="text-foreground font-semibold">Entity</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {sortedInstruments.map((instrument, index) => (
               <TableRow 
                 key={instrument.id}
                 className="hover:bg-secondary/20 transition-colors"
               >
                 <TableCell className="font-medium text-foreground">
                   <div className="flex items-center gap-2">
                     {instrument.noteBond}
                     <ExternalLink className="w-3 h-3 text-muted-foreground" />
                   </div>
                 </TableCell>
                 <TableCell>
                   <span className={`px-2 py-1 rounded text-sm font-mono ${
                     instrument.interestRate > 4 
                       ? 'bg-destructive/20 text-destructive' 
                       : instrument.interestRate > 3 
                         ? 'bg-chart-4/20 text-chart-4'
                         : 'bg-accent/20 text-accent'
                   }`}>
                     {instrument.interestRate.toFixed(3)}%
                   </span>
                 </TableCell>
                 <TableCell className="font-mono text-muted-foreground">
                   {instrument.dueYear}
                 </TableCell>
                 <TableCell className="font-semibold text-foreground">
                   {instrument.amountFormatted}
                 </TableCell>
                 <TableCell className="text-muted-foreground font-mono">
                   ${instrument.annualInterest.toFixed(2)}M
                 </TableCell>
                 <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                   {instrument.relatedEntity}
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </div>
     </motion.div>
   );
 };
 
 export default DataTable;