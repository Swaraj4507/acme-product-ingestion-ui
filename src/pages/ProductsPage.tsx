import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductTable } from "@/components/ProductTable";
import { ProductFormModal } from "@/components/ProductFormModal";
import { TaskProgressDialog } from "@/components/TaskProgressDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Product } from "@/types";
import { axiosClient, ApiResponse } from "@/api/axiosClient";
import { Plus, Search, Trash2, Package } from "lucide-react";
import { toast } from "sonner";

export const ProductsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkDeleteProgress, setShowBulkDeleteProgress] = useState(false);
  const [bulkDeleteTaskId, setBulkDeleteTaskId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useProducts({
    page,
    limit: 10,
    search: search || undefined,
    active: activeFilter,
  });

  const handleCreate = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      await axiosClient.post<ApiResponse<Product>>("/products", productData);
      toast.success("Product created successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
      throw error;
    }
  };

  const handleUpdate = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    if (!editingProduct) return;
    try {
      await axiosClient.put<ApiResponse<Product>>(`/products/${editingProduct.id}`, productData);
      toast.success("Product updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product");
      throw error;
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await axiosClient.delete(`/products/${product.id}`);
      toast.success("Product deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    try {
      const { data } = await axiosClient.post<ApiResponse<{ task_id: string }>>(
        "/products/bulk-delete?confirm=true"
      );

      setBulkDeleteTaskId(data.results.task_id);
      setShowBulkDeleteDialog(false);
      setShowBulkDeleteProgress(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to start bulk delete");
    }
  };

  const handleBulkDeleteComplete = () => {
    toast.success("All products deleted successfully");
    setBulkDeleteTaskId(null);
  };

  const products = data?.items || [];
  const totalProducts = data?.total || 0;

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 sm:h-8 sm:w-8" />
            Products
          </h1>
          {data && (
            <p className="text-sm text-muted-foreground mt-1">
              {totalProducts} {totalProducts === 1 ? "product" : "products"} total
            </p>
          )}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="destructive"
            onClick={() => setShowBulkDeleteDialog(true)}
            disabled={showBulkDeleteProgress}
            className="flex-1 sm:flex-initial"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Bulk Delete All</span>
            <span className="sm:hidden">Delete All</span>
          </Button>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find products by SKU, name, or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by SKU, name, or description..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={activeFilter === undefined ? "all" : activeFilter ? "active" : "inactive"}
              onValueChange={(value) => {
                setActiveFilter(value === "all" ? undefined : value === "active");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-sm text-destructive font-medium">{error}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <ProductTable
            products={products}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsFormOpen(true);
            }}
            onDelete={setDeleteProduct}
            loading={loading}
          />
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              Next
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {products.length} of {totalProducts} products
          </div>
        </div>
      )}

      <ProductFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={editingProduct}
        onSubmit={editingProduct ? handleUpdate : handleCreate}
      />

      <AlertDialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteProduct) {
                  handleDelete(deleteProduct);
                  setDeleteProduct(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Products</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete ALL products? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={showBulkDeleteProgress}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={showBulkDeleteProgress}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TaskProgressDialog
        open={showBulkDeleteProgress}
        onOpenChange={setShowBulkDeleteProgress}
        taskId={bulkDeleteTaskId}
        title="Bulk Delete Progress"
        description="Deleting all products. This may take a few moments."
        icon={Trash2}
        recordLabel="products"
        startingMessage="Starting bulk delete..."
        processingMessage="Deleting products..."
        completedMessage="Bulk delete completed successfully"
        failedMessage="Bulk delete failed"
        onComplete={handleBulkDeleteComplete}
      />
    </div>
  );
};

