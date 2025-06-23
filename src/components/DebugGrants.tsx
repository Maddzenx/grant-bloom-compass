
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DebugGrants = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const checkDatabase = async () => {
      console.log('🔥 DEBUG: Checking database connection and data...');
      
      try {
        // Test basic connection
        const { data: connectionTest, error: connectionError } = await supabase
          .from('grant_call_details')
          .select('count', { count: 'exact', head: true });
        
        console.log('🔥 DEBUG: Connection test result:', { connectionTest, connectionError });

        // Get row count
        const { count, error: countError } = await supabase
          .from('grant_call_details')
          .select('*', { count: 'exact', head: true });
        
        console.log('🔥 DEBUG: Row count result:', { count, countError });

        // Get first few rows
        const { data: sampleData, error: sampleError } = await supabase
          .from('grant_call_details')
          .select('id, title, organisation')
          .limit(5);
        
        console.log('🔥 DEBUG: Sample data result:', { sampleData, sampleError });

        setDebugInfo({
          connectionTest,
          connectionError,
          count,
          countError,
          sampleData,
          sampleError
        });

      } catch (error) {
        console.error('🔥 DEBUG: Database check failed:', error);
        setDebugInfo({ error: error.message });
      }
    };

    checkDatabase();
  }, []);

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold text-yellow-800">Database Debug Info</h3>
      <pre className="text-sm text-yellow-700 mt-2 overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};
