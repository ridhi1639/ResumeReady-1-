import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { setState, MOCK_SKILLS, MOCK_PROJECTS } from '@/lib/store';
import { Upload as UploadIcon, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import AppShell from '@/components/AppShell';

const Upload = () => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') return;
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    // Simulate extraction delay
    await new Promise(r => setTimeout(r, 2000));
    setState({
      resumeUploaded: true,
      resumeFileName: file.name,
      skills: MOCK_SKILLS.map(s => ({ ...s, readiness: 'not-assessed' as const, confidenceRatings: [], questionsAnswered: 0 })),
      projects: MOCK_PROJECTS,
      currentStep: 'review',
    });
    setProcessing(false);
    navigate('/review');
  };

  return (
    <AppShell>
      <div className="max-w-xl mx-auto py-16 px-4 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Upload your resume</h1>
          <p className="text-muted-foreground">
            We'll extract your skills and projects so you can practice defending them in interviews.
          </p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
            ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/30'}
            ${file ? 'bg-ready-bg border-ready/30' : ''}
          `}
          onClick={() => {
            if (!file) {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf';
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }
          }}
        >
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-ready" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Remove and choose another
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <UploadIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium mb-1">Drop your PDF here</p>
                <p className="text-sm text-muted-foreground">or click to browse · PDF only</p>
              </div>
            </div>
          )}
        </div>

        {file && (
          <div className="mt-6 animate-fade-in">
            <Button onClick={handleProcess} disabled={processing} className="w-full gap-2">
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting skills & projects...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Extract & Review
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Upload;
