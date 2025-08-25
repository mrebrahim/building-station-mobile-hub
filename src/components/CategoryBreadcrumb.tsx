import { Link } from "react-router-dom";
import { Home, ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  id?: number;
  name: string;
  path: string;
}

interface CategoryBreadcrumbProps {
  items: BreadcrumbItem[];
  currentPage?: string;
}

const CategoryBreadcrumb = ({ items, currentPage }: CategoryBreadcrumbProps) => {
  return (
    <div className="bg-white border-b border-gray-100 px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-blue-600">
                <Home className="w-4 h-4" />
                الرئيسية
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => (
            <div key={item.path} className="flex items-center gap-1">
              <BreadcrumbSeparator>
                <ChevronLeft className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {index === items.length - 1 && !currentPage ? (
                  <BreadcrumbPage className="text-blue-600 font-medium">
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="text-gray-600 hover:text-blue-600">
                      {item.name}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
          
          {currentPage && (
            <div className="flex items-center gap-1">
              <BreadcrumbSeparator>
                <ChevronLeft className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-blue-600 font-medium">
                  {currentPage}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </div>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CategoryBreadcrumb;