
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Mic, FileText, Users, Calendar, AlertTriangle } from "lucide-react";

// This defines the structure of the AI's output
interface SummaryResult {
  Summary: string;
  Decisions: string[];
  ActionItems: {
    Task: string;
    Assignee: string;
    DueDate: string;
    Priority: "High" | "Medium" | "Low";
  }[];
  Participants: string[];
}

// Sample data to show what the output will look like
const sampleData: SummaryResult = {
  Summary: "The team discussed the Q3 product launch strategy, focusing on marketing channels and budget allocation. A new timeline was proposed to accommodate development delays. Key concerns were raised about competitor activities.",
  Decisions: [
    "The new product launch date is set for September 15th.",
    "Marketing budget is approved for an additional $20,000.",
    "A/B testing for the new landing page will begin next week."
  ],
  ActionItems: [
    { Task: "Finalize the marketing brief for the new campaign.", Assignee: "Alice", DueDate: "2025-06-21", Priority: "High" },
    { Task: "Update the project timeline in the internal tracker.", Assignee: "Bob", DueDate: "2025-06-18", Priority: "Medium" },
    { Task: "Prepare the slide deck for the stakeholder update.", Assignee: "Charlie", DueDate: "2025-06-25", Priority: "Medium" },
    { Task: "Investigate competitor 'Project X' and report findings.", Assignee: "Alice", DueDate: "2025-07-01", Priority: "Low" },
  ],
  Participants: ["Alice", "Bob", "Charlie", "Diana", "Edward"],
};

const Index = () => {
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      setError("Please paste a transcript before generating a summary.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would make an API call here to your AI backend.
    // For now, we'll just use the sample data.
    setResult(sampleData);
    setIsLoading(false);
  };

  const getPriorityClass = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-100";
      case "Medium": return "text-yellow-600 bg-yellow-100";
      case "Low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-800">
          Meeting Insights <span className="text-primary">AI</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Turn your meeting transcripts into clear summaries and actionable tasks.
        </p>
      </header>

      <main>
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Paste Your Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the full text from your meeting here..."
              className="min-h-[200px] text-base"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {error}
              </p>
            )}
            <Button
              onClick={handleGenerateSummary}
              disabled={isLoading}
              className="mt-4 w-full md:w-auto"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
           <div className="text-center py-12">
             <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
             <p className="mt-4 text-lg text-muted-foreground">Analyzing transcript... this may take a moment.</p>
           </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-primary" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{result.Summary}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Key Decisions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 list-disc list-inside">
                    {result.Decisions.map((decision, index) => (
                      <li key={index} className="text-base">{decision}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {result.Participants.map((name, index) => (
                      <li key={index} className="flex items-center gap-3 text-base">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold">
                          {name.charAt(0)}
                        </div>
                        <span>{name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.ActionItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.Task}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            {item.Assignee}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-muted-foreground" />
                             {item.DueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityClass(item.Priority)}`}>
                            {item.Priority}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
