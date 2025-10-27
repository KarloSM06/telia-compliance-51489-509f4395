import { Globe, ExternalLink } from "lucide-react";
import linkedinIcon from "@/assets/linkedin-icon.webp";

interface ContactLinkGroupProps {
  linkedin?: string;
  company_linkedin?: string;
  website?: string;
  className?: string;
}

export function ContactLinkGroup({ linkedin, company_linkedin, website, className = "" }: ContactLinkGroupProps) {
  const hasAnyLink = linkedin || company_linkedin || website;
  
  if (!hasAnyLink) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {linkedin && (
        <a 
          href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={linkedinIcon} alt="LinkedIn" className="h-4 w-4 flex-shrink-0" />
          <span className="text-[#0077b5] text-sm font-medium group-hover:underline">
            Personlig profil
          </span>
          <ExternalLink className="h-3 w-3 text-[#0077b5] opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      
      {company_linkedin && (
        <a 
          href={company_linkedin.startsWith('http') ? company_linkedin : `https://${company_linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <img src={linkedinIcon} alt="LinkedIn" className="h-4 w-4 flex-shrink-0" />
          <span className="text-[#0077b5]/80 text-sm font-medium group-hover:underline">
            Företag
          </span>
          <ExternalLink className="h-3 w-3 text-[#0077b5]/80 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
      
      {website && (
        <a 
          href={website.startsWith('http') ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="h-4 w-4 flex-shrink-0 text-emerald-600" />
          <span className="text-emerald-600 text-sm font-medium group-hover:underline truncate max-w-[180px]">
            {website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
          </span>
          <ExternalLink className="h-3 w-3 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
    </div>
  );
}