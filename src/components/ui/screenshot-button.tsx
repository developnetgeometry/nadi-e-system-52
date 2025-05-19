
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { takeScreenshot, shareScreenshot } from '@/utils/screenshot';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotButtonProps {
  targetId: string;
  filename?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: React.ReactNode;
  showShare?: boolean;
}

export function ScreenshotButton({ 
  targetId, 
  filename = 'screenshot.png',
  className,
  variant = "default",
  children,
  showShare = true
}: ScreenshotButtonProps) {
  const { toast } = useToast();

  const handleDownload = async () => {
    const result = await takeScreenshot(targetId, filename);
    if (result) {
      toast({
        title: "Screenshot captured",
        description: "Your screenshot has been downloaded.",
      });
    } else {
      toast({
        title: "Screenshot failed",
        description: "Unable to capture screenshot. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const result = await shareScreenshot(targetId, filename.replace('.png', ''));
    if (result) {
      toast({
        title: "Screenshot shared",
        description: "Your screenshot has been shared successfully.",
      });
    } else {
      toast({
        title: "Sharing failed",
        description: "Unable to share screenshot. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Button 
        onClick={handleDownload} 
        variant={variant}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        {children || "Download"}
      </Button>
      
      {showShare && navigator.share && (
        <Button 
          onClick={handleShare} 
          variant={variant}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      )}
    </div>
  );
}
