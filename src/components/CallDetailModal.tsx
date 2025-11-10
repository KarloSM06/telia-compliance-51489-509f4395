import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock, FileAudio } from "lucide-react";

interface Violation {
  timestamp: string;
  rule: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Call {
  id: string;
  file_name: string;
  status: string;
  score: number | null;
  sale_outcome: boolean | null;
  created_at: string;
  encrypted_transcript: string | null;
  encrypted_analysis: any;
  duration: string | null;
  // Computed fields from encrypted_analysis
  analysis?: string | null;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  improvements?: string[] | null;
  violations?: any[] | null;
}

interface CallDetailModalProps {
  call: Call | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CallDetailModal = ({ call, isOpen, onClose }: CallDetailModalProps) => {
  if (!call) return null;

  const violations = call.violations as Violation[] | null;
  const hasViolations = violations && violations.length > 0;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 text-red-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-orange-500 bg-orange-50 text-orange-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileAudio className="h-5 w-5" />
            <span>{call.file_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {hasViolations ? (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 font-medium">Överträdelser hittade</span>
                    </>
                  ) : call.status === 'completed' ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-medium">Godkänt</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Bearbetas...</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Varaktighet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{call.duration || 'Okänt'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Försäljning</CardTitle>
              </CardHeader>
              <CardContent>
                {call.sale_outcome !== null ? (
                  <Badge variant={call.sale_outcome ? "default" : "secondary"}>
                    {call.sale_outcome ? "Genomförd" : "Ej genomförd"}
                  </Badge>
                ) : (
                  <span className="text-gray-500">Okänt</span>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Violations */}
          {hasViolations && violations && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>Upptäckta regelöverträdelser ({violations.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violations.map((violation, index) => (
                    <div key={index} className={`p-4 border-l-4 rounded-r-lg ${getSeverityColor(violation.severity)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getSeverityIcon(violation.severity)}
                            <span className="font-medium text-sm">
                              {violation.timestamp}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {violation.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-medium mb-1">{violation.rule}</h4>
                          <p className="text-sm">{violation.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compliance Message */}
          {!hasViolations && call.status === 'completed' && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-medium">Samtalet följer alla kvalitetsriktlinjer</h3>
                    <p className="text-sm">Inga regelöverträdelser upptäcktes under analysen.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Strengths and Improvements */}
          {(call.strengths || call.improvements) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {call.strengths && call.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-green-700">Styrkor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {call.strengths.map((strength, index) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {call.improvements && call.improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-blue-700">Förbättringsområden</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {call.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mt-1 flex-shrink-0"></div>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};