
import { AlertTriangle } from "lucide-react";

const UnderDevelopment = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
    <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
    <h1 className="text-4xl font-bold mb-2">Page Under Development</h1>
    <p className="mb-4 text-muted-foreground">
      This page is currently under development. Please check back soon!
    </p>
  </div>
);

export default UnderDevelopment;
