// /src/pages/dashboard/ProductsPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import CategorySection from "@/components/dashboard/CategorySection";
import ProductSection from "@/components/dashboard/ProductSection";

type ProductTab = 'categories' | 'products';

export default function ProductsPage() {
  const [currentTab, setCurrentTab] = useState<ProductTab>('categories');

  const renderTabContent = () => {
    switch (currentTab) {
      case 'categories':
        return <CategorySection />;
      case 'products':
        return <ProductSection />;
      default:
        return null;
    }
  };

    const activeTabClasses =
    "border-b-2 border-[#004d66] text-[#004d66] font-semibold";
  const inactiveTabClasses = "text-gray-500 hover:text-gray-800";

  return (
    <div className="flex h-auto bg-gray-100">
      <div className="flex-1 flex flex-col p-6 bg-white rounded-md overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Product Management
        </h1>

        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          <Button
            variant="ghost"
            className={cn(
              "relative px-4 py-3 rounded-none transition-colors duration-200 cursor-pointer",
              currentTab === "categories" ? activeTabClasses : inactiveTabClasses
            )}
            onClick={() => setCurrentTab("categories")}
          >
           Categories
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "relative px-4 py-3 rounded-none transition-colors duration-200 cursor-pointer",
              currentTab === "products" ? activeTabClasses : inactiveTabClasses
            )}
            onClick={() => setCurrentTab("products")}
          >
            Products
          </Button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>
      </div>
    </div>
  )
}

