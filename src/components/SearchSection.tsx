 import { useState } from 'react';
 import { motion } from 'framer-motion';
import { Search, Upload, Building2, FileText, ArrowRight, Loader2, FileSpreadsheet, File } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { sampleCompanies } from '@/lib/mockData';
 
 interface SearchSectionProps {
   onAnalyze: (cik: string, companyName: string) => void;
   isLoading: boolean;
 }
 
 const SearchSection = ({ onAnalyze, isLoading }: SearchSectionProps) => {
   const [cik, setCik] = useState('');
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
 
   const handleCikSubmit = () => {
     const cleanCik = cik.replace(/\D/g, '').padStart(10, '0');
     const companyName = sampleCompanies[cleanCik] || `Company CIK: ${cleanCik}`;
     onAnalyze(cleanCik, companyName);
   };
 
   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
       setSelectedFile(file);
       onAnalyze('uploaded', file.name.replace('.pdf', ''));
     }
   };
 
   const handleQuickSelect = (cikValue: string, name: string) => {
     setCik(cikValue);
     onAnalyze(cikValue, name);
   };
 
   return (
     <motion.section
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.3 }}
      className="container px-4 py-12"
     >
       <div className="max-w-4xl mx-auto">
        <div className="glass-card glass-card-hover p-8 shadow-card">
          <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            Financial Data Input
           </h2>
          <p className="text-muted-foreground mb-6">Choose your preferred method to analyze SEC filings</p>
 
           <Tabs defaultValue="cik" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/30 p-1 rounded-xl">
              <TabsTrigger value="cik" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                 <Building2 className="w-4 h-4" />
                 CIK Number
               </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                <Upload className="w-4 h-4" />
                Upload Document
               </TabsTrigger>
             </TabsList>
 
             <TabsContent value="cik" className="space-y-6">
               <div className="flex gap-4">
                 <div className="flex-1 relative">
                   <Input
                     type="text"
                     placeholder="Enter CIK Number (e.g., 0000320193)"
                     value={cik}
                     onChange={(e) => setCik(e.target.value)}
                    className="h-14 text-lg bg-secondary/30 border-border focus:border-primary focus:ring-primary pl-4 rounded-xl"
                   />
                 </div>
                 <Button 
                   onClick={handleCikSubmit}
                   disabled={!cik.trim() || isLoading}
                  className="h-14 px-8 btn-premium text-primary-foreground hover:opacity-90 transition-all rounded-xl"
                 >
                   {isLoading ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <>
                       Analyze
                       <ArrowRight className="w-5 h-5 ml-2" />
                     </>
                   )}
                 </Button>
               </div>
 
               {/* Quick select companies */}
               <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-medium">Quick Select Popular Companies:</p>
                 <div className="flex flex-wrap gap-2">
                   {Object.entries(sampleCompanies).slice(0, 6).map(([cikVal, name]) => (
                     <button
                       key={cikVal}
                       onClick={() => handleQuickSelect(cikVal, name)}
                      className="chip-action hover:shadow-glow"
                     >
                       {name}
                     </button>
                   ))}
                 </div>
               </div>
             </TabsContent>
 
            <TabsContent value="upload" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block cursor-pointer">
                  <div className="glass-card glass-card-hover p-6 text-center transition-all hover:border-primary/50">
                    <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">PDF Document</p>
                    <p className="text-xs text-muted-foreground">10-K, 10-Q filings</p>
                  </div>
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </label>
                
                <label className="block cursor-pointer">
                  <div className="glass-card glass-card-hover p-6 text-center transition-all hover:border-accent/50">
                    <File className="w-10 h-10 text-accent mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">Word Document</p>
                    <p className="text-xs text-muted-foreground">.doc, .docx files</p>
                  </div>
                  <input type="file" accept=".doc,.docx" onChange={handleFileUpload} className="hidden" />
                </label>
                
                <label className="block cursor-pointer">
                  <div className="glass-card glass-card-hover p-6 text-center transition-all hover:border-chart-4/50">
                    <FileSpreadsheet className="w-10 h-10 text-chart-4 mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">Excel Spreadsheet</p>
                    <p className="text-xs text-muted-foreground">.xls, .xlsx files</p>
                  </div>
                  <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
              
              {selectedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/30"
                >
                  <FileText className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                  <span className="ml-auto text-xs text-accent">Ready to analyze</span>
                </motion.div>
              )}
             </TabsContent>
           </Tabs>
         </div>
       </div>
     </motion.section>
   );
 };
 
 export default SearchSection;