import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { HeaderNav } from "../components/headerNav";
import MTCTouchForm from '../components/MTCTouchForm';
const api_base_url = import.meta.env.VITE_API_BASE_URL;

interface Service {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export function ServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`http://${api_base_url}/services`, {
          method: 'GET',
          credentials: 'include', // Include credentials to send session cookie
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setServices(data); // Set the fetched services data
        } else {
          console.error('Failed to fetch services:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
  
    fetchServices();
  }, []);
  
  const handleCardClick = (service: Service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Sticky HeaderNav */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <HeaderNav onSearch={handleSearch} />
      </div>

      {/* Services Grid */}
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <AlertDialog key={service.id}>
              <AlertDialogTrigger asChild>
                <Card
                  onClick={() => handleCardClick(service)}
                  className="cursor-pointer rounded-lg shadow-none border-none"
                >
                  <CardHeader className="p-0">
                    <div
                      className="w-full h-32 overflow-hidden rounded-t-lg flex items-center justify-center"
                      style={{ backgroundColor: "transparent" }}
                    >
                      <img
                        src={`http://${api_base_url}${service.image_url}`}
                        alt={service.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <CardTitle className="text-lg font-medium">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {service.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </AlertDialogTrigger>
              {selectedService && selectedService.id === service.id && (
                <AlertDialogContent className="max-w-sm w-full p-4">
                  <AlertDialogHeader>
                    <AlertDialogTitle>{selectedService.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {/* Optional description or content */}
                    </AlertDialogDescription>
                    <MTCTouchForm onClose={closeModal} serviceName={selectedService.title} />
                  </AlertDialogHeader>
                  <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
                </AlertDialogContent>
              )}
            </AlertDialog>
          ))}
        </div>
      </div>
    </>
  );
}

export default ServicesPage;
