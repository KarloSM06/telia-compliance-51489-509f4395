import { Check, AlertTriangle, Circle } from "lucide-react";

export const ScanningAnalysisVisual = () => {
  const checklist = [{
    label: "System check",
    status: "success"
  }, {
    label: "Process check",
    status: "success"
  }, {
    label: "Speed check",
    status: "warning"
  }, {
    label: "Manual work",
    status: "error"
  }, {
    label: "Repetitive task",
    status: "error"
  }];

  return <div className="relative h-full w-full flex items-center justify-between gap-2 md:gap-6 px-3 md:px-6 lg:px-10 bg-white/60 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg">
      {/* Left side: Circular radar scanner */}
      <div className="relative w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[180px] lg:h-[180px] flex-shrink-0">
        {/* Concentric circles */}
        <svg className="w-full h-full absolute inset-0" viewBox="0 0 180 180" preserveAspectRatio="xMidYMid meet">
          <circle cx="50%" cy="50%" r="47%" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
          <circle cx="50%" cy="50%" r="36%" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
          <circle cx="50%" cy="50%" r="25%" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
          <circle cx="50%" cy="50%" r="14%" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-200/40" />
        </svg>

        {/* Scanning beam - CSS animation */}
        <div className="absolute inset-0 animate-[rotate_4s_linear_infinite]" style={{
          filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))"
        }}>
          <div className="absolute top-0 left-1/2 w-2 h-1/2 origin-bottom -translate-x-1/2" style={{
            background: "linear-gradient(180deg, rgba(99, 102, 241, 0) 0%, rgba(99, 102, 241, 1) 30%, rgba(139, 92, 246, 0.8) 60%, rgba(167, 139, 250, 0.3) 100%)"
          }} />
        </div>

        {/* Center pulse */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[pulse_3s_ease-in-out_infinite]" />
      </div>

      {/* Right side: Workflow checklist */}
      <div className="flex-1 space-y-1.5 md:space-y-3">
        {checklist.map((item, index) => <div 
          key={item.label} 
          className="flex items-center gap-2 md:gap-4 transition-transform duration-200 hover:scale-105 animate-[slideInLeft_0.5s_ease-out]"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
            {/* Status icon */}
            <div className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full ${item.status === "success" ? "bg-green-500/20 text-green-600" : item.status === "warning" ? "bg-orange-500/20 text-orange-600" : "bg-red-500/20 text-red-600"}`}>
              {item.status === "success" && <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />}
              {item.status === "warning" && <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />}
              {item.status === "error" && <Circle className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />}
            </div>

            {/* Label */}
            <span className="text-xs md:text-sm lg:text-base font-semibold text-gray-900">{item.label}</span>
          </div>)}
      </div>
    </div>;
};

export default ScanningAnalysisVisual;