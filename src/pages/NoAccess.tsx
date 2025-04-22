
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XOctagon } from "lucide-react";

const NoAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/admin/dashboard", { replace: true });
    }, 3000); // 3 seconds

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
      <XOctagon className="w-16 h-16 text-red-600 mb-4" />
      <h1 className="text-3xl font-bold mb-2">You don&apos;t have access to this page</h1>
      <p className="mb-4 text-muted-foreground">
        You will be redirected to the dashboard shortly.
      </p>
    </div>
  );
};

export default NoAccess;
