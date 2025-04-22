
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { XOctagon } from "lucide-react";
import { Container } from "@/components/ui/container";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally: auto-redirect after some seconds
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
      <Container>
        <XOctagon className="w-16 h-16 text-red-600 mb-4 mx-auto" />
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          Sorry, the page you&apos;re looking for does not exist.
        </p>
        <button
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
          onClick={() => navigate("/admin/dashboard")}
        >
          Go to Dashboard
        </button>
      </Container>
    </div>
  );
};

export default NotFound;
