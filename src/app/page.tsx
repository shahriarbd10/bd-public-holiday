import { getHolidays } from "@/lib/data";
import { HolidayClientView } from "@/components/holiday-client-view";

export default async function Home() {
  const { source, data: holidays } = await getHolidays();

  // Generate JSON-LD schema for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": holidays.map((holiday, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Event",
        "name": holiday.name,
        "startDate": `2026-${parseDateToISO(holiday.date)}`,
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "Bangladesh",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BD"
          }
        },
        "description": `${holiday.name} is a ${holiday.type} observed in Bangladesh.`
      }
    }))
  };

  // Map to safely filter consecutive duplicate holiday names
  const uniqueHolidays = holidays.filter((h, index, array) => {
    if (index === 0) return true;
    return h.name !== array[index - 1].name;
  });

  return (
    <main className="w-full">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4 md:px-6 pt-8">
        <HolidayClientView initialHolidays={uniqueHolidays} source={source} />
      </div>
    </main>
  );
}

// Helper function to format Mar 17 into a sortable 03-17 format for JSON-LD SEO
function parseDateToISO(dateStr: string) {
  const parts = dateStr.trim().split(' ');
  const monthMap: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  const month = monthMap[parts[0]] || '01';
  const day = parts[1]?.padStart(2, '0') || '01';
  return `${month}-${day}`;
}
