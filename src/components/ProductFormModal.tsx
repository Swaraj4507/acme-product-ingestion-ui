import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Product } from "@/types";
import { Label } from "@/components/ui/label";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<void>;
}

export const ProductFormModal = ({
  open,
  onOpenChange,
  product,
  onSubmit,
}: ProductFormModalProps) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      active: true,
    },
  });

  const active = watch("active");

  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        active: product.active,
      });
    } else {
      reset({
        sku: "",
        name: "",
        description: "",
        active: true,
      });
    }
  }, [product, reset]);

  const onFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Create Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product information below."
              : "Fill in the details to create a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              {...register("sku", { required: true })}
              placeholder="Enter SKU"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Enter product name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description")}
              placeholder="Enter product description"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={(checked) => setValue("active", checked)}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

