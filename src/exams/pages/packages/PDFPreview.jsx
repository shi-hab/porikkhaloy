import { ExternalLink, FileText} from "lucide-react";
import { Button } from "@/components/ui/button";

const PDFPreview = ({ fileUrl, fileName }) => {


  const baseUrl = import.meta.env.VITE_SERVER_FILE_URL;
  
  const fullPdfUrl = fileUrl?.startsWith('https') 
    ? fileUrl 
    : `${baseUrl}${fileUrl}`;


  if (!fileUrl) return null;

  return (
    <div className="flex flex-col w-full gap-3 mt-4">
      <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-slate-900">
        <div className="flex items-center gap-2 overflow-hidden">
          <FileText className="w-5 h-5 text-blue-500 shrink-0" />
          <span className="text-sm font-medium truncate">
            {fileName || "উত্তরপত্র.pdf"}
          </span>
        </div>
        
        <Button 
          onClick={() => window.open(fullPdfUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PDFPreview;