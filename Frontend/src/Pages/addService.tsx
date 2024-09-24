import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HeaderNav } from "../components/headerNav";
import { ToastProvider, Toast, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle, Plus, MinusCircle, AlertTriangle } from "lucide-react";
import placeholderImg from "../assets/placeholder.jpg";
const api_base_url = import.meta.env.VITE_API_BASE_URL;

export function AddNewService() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accounts, setAccounts] = useState([{ credit: "", debit: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(placeholderImg);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"default" | "destructive">("default");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const handleAccountChange = (index: number, field: "credit" | "debit", value: string) => {
    const newAccounts = [...accounts];
    newAccounts[index][field] = value;
    setAccounts(newAccounts);
  };

  const handleAddAccountPair = () => {
    setAccounts([...accounts, { credit: "", debit: "" }]);
  };

  const handleRemoveAccountPair = (index: number) => {
    const newAccounts = accounts.filter((_, i) => i !== index);
    setAccounts(newAccounts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!title || !description || !image || accounts.some(account => !account.credit || !account.debit)) {
      setToastMessage("All fields are required, including an image.");
      setToastVariant("destructive");
      setShowToast(true);
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('CreditAccount', JSON.stringify(accounts.map(account => account.credit)));
    formData.append('DebitAccount', JSON.stringify(accounts.map(account => account.debit)));
    
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const response = await fetch(`http://${api_base_url}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
  
      if (response.ok) {
        setToastMessage("Service added successfully!");
        setToastVariant("default");
        setShowToast(true);
  
        // Reset form fields
        setTitle("");
        setDescription("");
        setAccounts([{ credit: "", debit: "" }]);
        setImage(null);
        setPreviewImage(placeholderImg);
      } else {
        setToastMessage("Failed to add service");
        setToastVariant("destructive");
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setToastMessage("Error adding service");
      setToastVariant("destructive");
      setShowToast(true);
    }
  };
  

  return (
    <ToastProvider>
      <HeaderNav onSearch={function (): void {
              throw new Error("Function not implemented.");
          } } />
      <h1 className="text-4xl font-semibold pt-10 pb-0">Add Service</h1>
      <div className="flex justify-center items-start p-4 pt-0">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl mt-4">
          <Card className="p-6 mt-4 shadow-lg">
            <CardHeader className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <div className="w-full h-48 overflow-hidden rounded-full flex items-center justify-center ">
                    <img
                      src={previewImage}
                      alt="Service"
                      className="max-h-full max-w-full object-cover rounded-full"
                    />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="image">Service Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="col-span-2 grid gap-4">
                  <div>
                    <Label htmlFor="title">Service Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter service title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Service Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter service description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      className="h-24"
                    />
                  </div>

                  {accounts.map((account, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="flex-1">
                        <Label htmlFor={`creditAccount-${index}`}>Credit Account</Label>
                        <Input
                          id={`creditAccount-${index}`}
                          type="text"
                          placeholder="Credit Account"
                          value={account.credit}
                          onChange={(e) => handleAccountChange(index, "credit", e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`debitAccount-${index}`}>Debit Account</Label>
                        <Input
                          id={`debitAccount-${index}`}
                          type="text"
                          placeholder="Debit Account"
                          value={account.debit}
                          onChange={(e) => handleAccountChange(index, "debit", e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex items-center">
                        {accounts.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            className="p-2 flex justify-center items-center"
                            onClick={() => handleRemoveAccountPair(index)}
                            style={{ marginTop: '22px' }} // Move button down by 5px
                          >
                            <MinusCircle className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-2"
                    onClick={handleAddAccountPair}
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add Account Pair
                  </Button>

                  <Button type="submit" className="mt-6 w-full">
                    Add Service
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        </form>
      </div>

      <ToastViewport />
      {showToast && (
        <Toast variant={toastVariant} onOpenChange={setShowToast}>
          <div className="flex items-center">
            {toastVariant === "default" && (
              <CheckCircle className="text-green-500 mr-2" />
            )}
            {toastVariant === "destructive" && (
              <AlertTriangle className="text-red-500 mr-2" />
            )}
            <div>
              <ToastTitle>{toastMessage}</ToastTitle>
            </div>
          </div>
        </Toast>
      )}
    </ToastProvider>
  );
}

export default AddNewService;
