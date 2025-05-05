
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-20 md:py-24">
        <Container>
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Welcome to HR Management</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Manage your organization's human resources efficiently with our comprehensive HR platform.
            </p>
            <div className="flex gap-4 mt-6">
              <Button asChild size="lg">
                <Link to="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/login">
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
