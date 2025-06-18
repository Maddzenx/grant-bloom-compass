
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Home, Search, FileText, CheckSquare } from "lucide-react";
import DiscoverGrants from "./DiscoverGrants";
import BusinessPlanEditor from "./BusinessPlanEditor";
import ProgressChecklist from "./ProgressChecklist";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/discover", icon: Search, label: "Discover Grants" },
    { path: "/editor", icon: FileText, label: "Business Plan Editor" },
    { path: "/progress", icon: CheckSquare, label: "Progress & Upload" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-semibold text-gray-900">Grant Application Tool</h1>
          <div className="flex space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto py-16 px-6">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Grant Application Tool
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Streamline your grant application process from discovery to submission with our comprehensive tool designed for early-stage founders.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <Link
            to="/discover"
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover Grants</h3>
            <p className="text-gray-600">Find and explore available grants that match your startup's needs and goals.</p>
          </Link>
          <Link
            to="/editor"
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Plan Editor</h3>
            <p className="text-gray-600">Create and refine your business plan with AI-powered suggestions and guidance.</p>
          </Link>
          <Link
            to="/progress"
            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
          >
            <CheckSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress & Upload</h3>
            <p className="text-gray-600">Track your application progress and upload required documents.</p>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverGrants />} />
          <Route path="/editor" element={<BusinessPlanEditor />} />
          <Route path="/progress" element={<ProgressChecklist />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Index;
