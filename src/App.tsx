import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Employees from "./pages/Employees";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";

type Page = "dashboard" | "inventory" | "sales" | "employees" | "stores";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  const handleStoreClick = (storeId: number) => {
    setSelectedStore(storeId);
  };

  const handleBackFromStore = () => {
    setSelectedStore(null);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setSelectedStore(null);
  };

  const renderContent = () => {
    if (selectedStore !== null) {
      return <StoreDetail storeId={selectedStore} onBack={handleBackFromStore} />;
    }
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onStoreClick={handleStoreClick} />;
      case "inventory":
        return <Inventory />;
      case "sales":
        return <Sales />;
      case "employees":
        return <Employees />;
      case "stores":
        return <Stores onStoreClick={(id) => { handleStoreClick(id); }} />;
      default:
        return <Dashboard onStoreClick={handleStoreClick} />;
    }
  };

  return (
    <Layout
      currentPage={selectedStore !== null ? "stores" : currentPage}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
}
