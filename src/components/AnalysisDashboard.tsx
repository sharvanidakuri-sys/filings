 import { useState, useRef } from 'react';
 import { motion } from 'framer-motion';
 import { AnalysisResult } from '@/types/finance';
 import MetricsGrid from './MetricsGrid';
 import DataTable from './DataTable';
 import DebtCharts from './DebtCharts';
 import ChatInterface from './ChatInterface';
 import Sidebar from './Sidebar';
import QuickActions from './QuickActions';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, BarChart3, MessageCircle, FileText, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 
 interface AnalysisDashboardProps {
   data: AnalysisResult;
   onBack?: () => void;
 }
 
 const AnalysisDashboard = ({ data, onBack }: AnalysisDashboardProps) => {
   const [activeTab, setActiveTab] = useState('overview');
   const chatRef = useRef<{ sendMessage: (q: string) => void } | null>(null);
 
   const handleQuestionFromSidebar = (question: string) => {
     setActiveTab('qa');
     // Trigger the chat to send this question
     setTimeout(() => {
       chatRef.current?.sendMessage(question);
     }, 100);
   };
 
   return (
     <div className="flex min-h-screen">
       <Sidebar onQuestionClick={handleQuestionFromSidebar} />
       
      <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-background via-background to-secondary/20">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
         >
           {/* Company Header */}
          <div className="mb-8 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onBack}
                    className="gap-2 glass-card-hover"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    New Search
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="gap-2 glass-card-hover"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-medium text-accent">Live Data</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              {data.companyName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
               <span>CIK: {data.cik}</span>
               <span>•</span>
               <span>Filing: {data.filingType}</span>
               <span>•</span>
               <span>Date: {data.filingDate}</span>
              <span>•</span>
              <span className="text-primary font-medium">{data.instrumentCount} Instruments</span>
             </div>
           </div>
 
           {/* Metrics */}
           <MetricsGrid data={data} />
 
           {/* Tabs */}
           <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="glass-card p-1.5 mb-6">
               <TabsTrigger 
                 value="overview" 
                className="gap-2 rounded-lg data-[state=active]:btn-premium data-[state=active]:text-primary-foreground transition-all"
               >
                 <FileText className="w-4 h-4" />
                 Overview
               </TabsTrigger>
               <TabsTrigger 
                 value="charts" 
                className="gap-2 rounded-lg data-[state=active]:btn-premium data-[state=active]:text-primary-foreground transition-all"
               >
                 <BarChart3 className="w-4 h-4" />
                 Visualizations
               </TabsTrigger>
               <TabsTrigger 
                 value="data" 
                className="gap-2 rounded-lg data-[state=active]:btn-premium data-[state=active]:text-primary-foreground transition-all"
               >
                 <Table className="w-4 h-4" />
                 Data Table
               </TabsTrigger>
               <TabsTrigger 
                 value="qa" 
                className="gap-2 rounded-lg data-[state=active]:btn-premium data-[state=active]:text-primary-foreground transition-all"
               >
                 <MessageCircle className="w-4 h-4" />
                 Q&A Analysis
               </TabsTrigger>
             </TabsList>
 
             <TabsContent value="overview" className="mt-0">
              <QuickActions onAction={handleQuestionFromSidebar} />
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                 <div className="xl:col-span-2">
                   <DebtCharts data={data} />
                 </div>
                 <ChatInterface data={data} />
               </div>
             </TabsContent>
 
             <TabsContent value="charts" className="mt-0">
              <QuickActions onAction={handleQuestionFromSidebar} />
               <DebtCharts data={data} />
             </TabsContent>
 
             <TabsContent value="data" className="mt-0">
               <DataTable data={data} />
             </TabsContent>
 
             <TabsContent value="qa" className="mt-0">
               <div className="max-w-3xl mx-auto">
                 <ChatInterface data={data} />
               </div>
             </TabsContent>
           </Tabs>
         </motion.div>
       </main>
     </div>
   );
 };
 
 export default AnalysisDashboard;