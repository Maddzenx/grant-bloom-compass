import React from "react";
import { GrantDetails as GrantDetailsType } from "@/types/grant";

interface GrantNotionImportantDatesSectionProps {
  grant: GrantDetailsType;
}

interface DateItem {
  date: string;
  label: string;
  link?: string;
}

const GrantNotionImportantDatesSection = ({ grant }: GrantNotionImportantDatesSectionProps) => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Datum saknas";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Datum saknas";
    
    const day = date.getDate();
    const month = date.toLocaleDateString('sv-SE', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getImportantDates = (): { validDates: DateItem[], otherEvents: DateItem[] } => {
    const validDates: DateItem[] = [];
    const otherEvents: DateItem[] = [];

    // Debug logging
    console.log('🔍 GrantNotionImportantDatesSection - Grant date fields:', {
      application_opening_date: grant.application_opening_date,
      application_closing_date: grant.application_closing_date,
      project_start_date_min: grant.project_start_date_min,
      project_start_date_max: grant.project_start_date_max,
      project_end_date_min: grant.project_end_date_min,
      project_end_date_max: grant.project_end_date_max,
      information_webinar_dates: grant.information_webinar_dates,
      information_webinar_names: grant.information_webinar_names,
      information_webinar_links: grant.information_webinar_links,
      other_important_dates: grant.other_important_dates,
      other_important_dates_labels: grant.other_important_dates_labels
    });

    // Application opening date
    if (grant.application_opening_date) {
      validDates.push({
        date: grant.application_opening_date,
        label: "Ansökan öppnar"
      });
    }

    // Application closing date
    if (grant.application_closing_date) {
      validDates.push({
        date: grant.application_closing_date,
        label: "Ansökan stänger"
      });
    }

    // Project start dates
    if (grant.project_start_date_min) {
      validDates.push({
        date: grant.project_start_date_min,
        label: "Tidigaste projektstart"
      });
    }

    if (grant.project_start_date_max && grant.project_start_date_max !== grant.project_start_date_min) {
      validDates.push({
        date: grant.project_start_date_max,
        label: "Senaste projektstart"
      });
    }

    // Project end dates
    if (grant.project_end_date_min) {
      validDates.push({
        date: grant.project_end_date_min,
        label: "Tidigaste projektslut"
      });
    }

    if (grant.project_end_date_max && grant.project_end_date_max !== grant.project_end_date_min) {
      validDates.push({
        date: grant.project_end_date_max,
        label: "Senaste projektslut"
      });
    }

    // Information webinars
    if (grant.information_webinar_dates && grant.information_webinar_dates.length > 0) {
      grant.information_webinar_dates.forEach((webinarDate, index) => {
        const webinarName = grant.information_webinar_names?.[index] || "Informationsmöte";
        const webinarLink = grant.information_webinar_links?.[index];
        
        if (webinarDate) {
          validDates.push({
            date: webinarDate,
            label: webinarName,
            link: webinarLink
          });
        } else {
          otherEvents.push({
            date: "",
            label: webinarName,
            link: webinarLink
          });
        }
      });
    }

    // Other important dates
    if (grant.other_important_dates && grant.other_important_dates.length > 0) {
      grant.other_important_dates.forEach((importantDate, index) => {
        const dateLabel = grant.other_important_dates_labels?.[index] || "Viktigt datum";
        
        if (importantDate) {
          validDates.push({
            date: importantDate,
            label: dateLabel
          });
        } else {
          otherEvents.push({
            date: "",
            label: dateLabel
          });
        }
      });
    }

    // Sort valid dates chronologically
    validDates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return { validDates, otherEvents };
  };

  const { validDates, otherEvents } = getImportantDates();

  if (validDates.length === 0 && otherEvents.length === 0) return null;

  return (
    <div>
      {validDates.length > 0 && (
        <div className="mb-6">
          <h3 className="type-title text-zinc-900 mb-4">Viktiga datum</h3>
          <ul className="space-y-0">
            {validDates.map((item, index) => (
              <li key={index} className="type-secondary text-zinc-700 leading-relaxed">
                <span className="font-bold">{formatDate(item.date)}</span>: {item.label}
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7D54F4] underline hover:opacity-90 ml-1"
                  >
                    (länk)
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {otherEvents.length > 0 && (
        <div>
          <h3 className="type-title text-zinc-900 mb-4">Andra händelser</h3>
          <ul className="space-y-0">
            {otherEvents.map((item, index) => (
              <li key={index} className="type-secondary text-zinc-700 leading-relaxed flex items-start">
                <span className="mr-2 text-gray-500">•</span>
                <span>
                  {item.label}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7D54F4] underline hover:opacity-90 ml-1"
                    >
                      (länk)
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GrantNotionImportantDatesSection; 