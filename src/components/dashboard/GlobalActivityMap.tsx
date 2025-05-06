
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GlobalActivityMapProps {
  data?: any;
}

export const GlobalActivityMap: React.FC<GlobalActivityMapProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Activity Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
          <p className="text-muted-foreground">
            Map visualization unavailable. The react-simple-maps package needs to be installed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalActivityMap;
