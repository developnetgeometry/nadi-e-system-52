
import { useEffect, useState } from 'react';
import { checkRequiredEnvVars, getEnv } from '@/utils/env';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const EnvCheck = () => {
  const [missingVars, setMissingVars] = useState<string[]>([]);

  useEffect(() => {
    // Check for missing environment variables on component mount
    setMissingVars(checkRequiredEnvVars());
  }, []);

  // If all environment variables are set, don't render anything
  if (missingVars.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertTitle>Missing Environment Variables</AlertTitle>
      <AlertDescription>
        <p>The following environment variables are not set:</p>
        <ul className="list-disc ml-5 mt-2">
          {missingVars.map((key) => (
            <li key={key}>VITE_{key}</li>
          ))}
        </ul>
        <p className="mt-2">
          Please add these variables to your .env file in the project root.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default EnvCheck;
