import React from "react";
import { Grant } from "@/types/grant";

interface GrantNotionImportantDatesSectionProps {
  grant: Grant;
}

interface DateItem {
  date: string;
  label: string;
  link?: string;
}

const GrantNotionImportantDatesSection = ({ grant }: GrantNotionImportantDatesSectionProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('sv-SE', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getImportantDates = (): DateItem[] => {
    const dates: DateItem[] = [];

    // Application opening date
    if (grant.application_opening_date) {
      dates.push({
        date: grant.application_opening_date,
        label: "Ansökan Öppnar"
      });
    }

    // Application closing date
    if (grant.application_closing_date) {
      dates.push({
        date: grant.application_closing_date,
        label: "Ansökan Stänger"
      });
    }

    // Project start dates
    if (grant.project_start_date_min) {
      dates.push({
        date: grant.project_start_date_min,
        label: grant.project_start_date_max && grant.project_start_date_max !== grant.project_start_date_min 
          ? `Projekt Startar (${formatDate(grant.project_start_date_min)} - ${formatDate(grant.project_start_date_max)})`
          : "Projekt Startar"
      });
    }

    // Project end dates
    if (grant.project_end_date_min) {
      dates.push({
        date: grant.project_end_date_min,
        label: grant.project_end_date_max && grant.project_end_date_max !== grant.project_end_date_min
          ? `Projekt Slutar (${formatDate(grant.project_end_date_min)} - ${formatDate(grant.project_end_date_max)})`
          : "Projekt Slutar"
      });
    }

    // Information webinars
    if (grant.information_webinar_dates && grant.information_webinar_dates.length > 0) {
      grant.information_webinar_dates.forEach((webinarDate, index) => {
        const webinarName = grant.information_webinar_names?.[index] || "Informationsmöte";
        const webinarLink = grant.information_webinar_links?.[index];
        
        dates.push({
          date: webinarDate,
          label: webinarName,
          link: webinarLink
        });
      });
    }

    // Sort dates chronologically
    return dates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const importantDates = getImportantDates();

  if (importantDates.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Viktiga datum</h3>
      <ul className="space-y-2">
        {importantDates.map((item, index) => (
          <li key={index} className="text-sm text-gray-700 leading-relaxed">
            {formatDate(item.date)} - {item.label}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 ml-1"
              >
                (länk)
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GrantNotionImportantDatesSection; 