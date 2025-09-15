import { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { config } from "@/config";

interface Product {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  price: number;
  quantity: number;
  featured: boolean;
  brand: string | null;
  description: string | null;
  images: string[];
}

interface Category {
  id: string;
  name: string;
}

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category_id: "",
    price: 0,
    quantity: 0,
    brand: "",
    description: "",
    featured: false,
    imageFiles: [] as File[],
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const getToken = () => localStorage.getItem("authToken");

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${config.API_URL}/categories/list.php`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch {
      toast.error("Failed to fetch categories.");
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${config.API_URL}/products/list.php`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products.");
      console.error("Error fetching products: ", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handlePriceQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        imageFiles: e.target.files ? Array.from(e.target.files) : [],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = getToken();
    if (!token) {
      toast.error("Authentication token not found.");
      setIsSubmitting(false);
      return;
    }

    const url = formData.id
      ? `${config.API_URL}/products/update.php`
      : `${config.API_URL}/products/create.php`;
    const body = JSON.stringify({
      id: formData.id || undefined,
      name: formData.name,
      category_id: formData.category_id,
      price: formData.price,
      quantity: formData.quantity,
      brand: formData.brand || null,
      description: formData.description || null,
      featured: formData.featured,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body,
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to save product.");
      }

      const productId = formData.id || result.id;
      if (formData.imageFiles.length > 0 && productId) {
        const uploadPromises = formData.imageFiles.map(async (file) => {
          const uploadData = new FormData();
          uploadData.append("image", file);
          uploadData.append("product_id", productId);

          const uploadResponse = await fetch(
            `${config.API_URL}/products/upload.php`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` }, // ✅ keep this
              body: uploadData, // ✅ FormData will set correct multipart headers
            }
          );

          const uploadResult = await uploadResponse.json();
          if (!uploadResponse.ok || uploadResult.error) {
            throw new Error(uploadResult.error || "Image upload failed");
          }
          return uploadResult;
        });

        await Promise.all(uploadPromises);
      }

      toast.success(
        formData.id
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
      setIsDialogOpen(false);
      setFormData({
        id: "",
        name: "",
        category_id: "",
        price: 0,
        quantity: 0,
        brand: "",
        description: "",
        featured: false,
        imageFiles: [],
      });
      fetchProducts();
    } catch (error) {
      toast.error(
        `Error saving product: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
      console.error("Error saving product: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      price: product.price,
      quantity: product.quantity,
      brand: product.brand || "",
      description: product.description || "",
      featured: !!product.featured,
      imageFiles: [],
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    const token = getToken();
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    try {
      const response = await fetch(`${config.API_URL}/products/delete.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productToDelete }),
      });

      const result = await response.json();
      if (!response.ok || result.error) {
        throw new Error(result.error || "Failed to delete product.");
      }

      toast.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      toast.error(
        `Error deleting product: ${
          error instanceof Error ? error.message : "An unknown error occurred"
        }`
      );
      console.error("Error deleting product: ", error);
    } finally {
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() =>
                  setFormData({
                    id: "",
                    name: "",
                    category_id: "",
                    price: 0,
                    quantity: 0,
                    brand: "",
                    description: "",
                    featured: false,
                    imageFiles: [],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {formData.id ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category_id: value }))
                      }
                      value={formData.category_id}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handlePriceQuantityChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      step="1"
                      value={formData.quantity}
                      onChange={handlePriceQuantityChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2 flex items-center pt-6">
                    <Checkbox
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          featured: !!checked,
                        }))
                      }
                    />
                    <Label htmlFor="featured" className="ml-2">
                      Featured Product
                    </Label>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="imageFiles">Images</Label>
                    <Input
                      id="imageFiles"
                      name="imageFiles"
                      type="file"
                      onChange={handleImageChange}
                      multiple
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Pencil className="mr-2 h-4 w-4" />
                    )}
                    {formData.id ? "Update" : "Create"} Product
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetching ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-scale-down rounded"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.category_name}</TableCell>
                    <TableCell>Ksh {product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(product.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and its associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
            className="bg-red-500 cursor-pointer"
            onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
