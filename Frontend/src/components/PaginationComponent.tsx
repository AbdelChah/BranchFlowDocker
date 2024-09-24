import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <Pagination>
      <PaginationContent className="flex items-center justify-center space-x-6">
        {/* Previous Button */}
        <PaginationItem>
          <Button
            onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1} // Disable button on first page
            className="px-4 py-2" // Add padding for button styling
          >
            <ArrowLeft/>
          </Button>
        </PaginationItem>

        {/* Page Fraction Display */}
        <span className="text-sm font-medium">
          Page {currentPage}/{totalPages}
        </span>

        {/* Next Button */}
        <PaginationItem>
          <Button
            onClick={() =>
              onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)
            }
            disabled={currentPage === totalPages} // Disable button on last page
            className="px-4 py-2" // Add padding for button styling
          >
            <ArrowRight></ArrowRight>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
