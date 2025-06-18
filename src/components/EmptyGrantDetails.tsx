
import React from "react";
import { Search } from "lucide-react";

const EmptyGrantDetails = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Välj ett bidrag för att visa detaljer</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyGrantDetails;
