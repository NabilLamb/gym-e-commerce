//components\admin\ProductForm.tsx

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  category: z.enum(["equipment", "supplements", "clothes"]),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce
    .number()
    .positive()
    .optional()
    .refine((val) => !val || val > 0, "Must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required"),
  // Fix: allow empty string or a valid URL (video is optional)
  video: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        stock: z.coerce.number().int().min(0),
        sku: z.string().optional(),
      }),
    )
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "equipment",
      price: initialData?.price || undefined,
      originalPrice: initialData?.originalPrice || undefined,
      description: initialData?.description || "",
      images: initialData?.images || [],
      // Fix: use undefined instead of "" so Zod treats it as optional
      video: initialData?.video || undefined,
      stock: initialData?.stock || 0,
      variants: initialData?.variants || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const images = watch("images");
  const video = watch("video");

  const handleImageUpload = (result: any) => {
    const url = result.info.secure_url;
    const currentImages = watch("images") || [];
    setValue("images", [...currentImages, url], { shouldValidate: true });
  };

  const handleVideoUpload = (result: any) => {
    const url = result.info.secure_url;
    setValue("video", url, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const current = watch("images");
    setValue(
      "images",
      current.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
      const method = initialData ? "PUT" : "POST";

      // Clean up: remove empty video string before sending
      const payload = {
        ...data,
        video: data.video || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save product");
      }

      toast({
        title: "Success",
        description: `Product ${initialData ? "updated" : "created"} successfully.`,
      });

      router.push("/admin");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-3xl mx-auto px-6"
    >
      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm space-y-8">
        <div className="border-b border-border/50 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {initialData ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {initialData ? "Update the product details below." : "Fill in the fields to create a new product listing."}
          </p>
        </div>

      {/* Name */}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          onValueChange={(value) => setValue("category", value as any)}
          defaultValue={watch("category")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="supplements">Supplements</SelectItem>
            <SelectItem value="clothes">Clothes</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Price & Original Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price")}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price ($)</Label>
          <Input
            id="originalPrice"
            type="number"
            step="0.01"
            min="0"
            {...register("originalPrice")}
          />
          {errors.originalPrice && (
            <p className="text-sm text-red-500">
              {errors.originalPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* Stock */}
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input id="stock" type="number" min="0" {...register("stock")} />
        {errors.stock && (
          <p className="text-sm text-red-500">{errors.stock.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Images Upload */}
      <div>
        <Label>
          Product Images{" "}
          <span className="text-red-500">*</span>{" "}
          <span className="text-muted-foreground font-normal text-sm">
            (max 5, at least 1 required)
          </span>
        </Label>
        <div className="mt-2 flex flex-wrap gap-4">
          {images?.map((url, index) => (
            <div key={index} className="relative w-24 h-24">
              <Image
                src={url}
                alt={`Preview ${index}`}
                fill
                className="object-cover rounded border"
              />
              {/* First image badge */}
              {index === 0 && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-black/60 text-white rounded-b py-0.5">
                  Main
                </span>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => removeImage(index)}
              >
                ✕
              </Button>
            </div>
          ))}
          {(!images || images.length < 5) && (
            <CldUploadWidget
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_PRODUCTS!
              }
              onSuccess={handleImageUpload}
              options={{
                maxFiles: 5 - (images?.length || 0),
                clientAllowedFormats: ["image"],
              }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  className="w-24 h-24 flex flex-col gap-1"
                  onClick={() => open()}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span className="text-xs">Add Image</span>
                </Button>
              )}
            </CldUploadWidget>
          )}
        </div>
        {errors.images && (
          <p className="text-sm text-red-500 mt-1">{errors.images.message}</p>
        )}
      </div>

      {/* Video Upload */}
      <div>
        <Label>
          Product Video{" "}
          <span className="text-muted-foreground font-normal text-sm">
            (optional)
          </span>
        </Label>
        <div className="mt-2">
          {video ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground truncate max-w-xs">
                {video}
              </p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                // Fix: set to undefined so Zod treats field as not provided
                onClick={() => setValue("video", undefined, { shouldValidate: true })}
              >
                Remove
              </Button>
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset={
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_PRODUCTS!
              }
              onSuccess={handleVideoUpload}
              options={{ maxFiles: 1, clientAllowedFormats: ["video"] }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => open()}
                >
                  Upload Video
                </Button>
              )}
            </CldUploadWidget>
          )}
        </div>
        {errors.video && (
          <p className="text-sm text-red-500">{errors.video.message}</p>
        )}
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between">
          <Label>Variants (size, color, stock)</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ size: "", color: "", stock: 0, sku: "" })}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Variant
          </Button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-4 gap-4 mt-2 items-start"
          >
            <div>
              <Label className="text-xs">Size</Label>
              <Input
                {...register(`variants.${index}.size`)}
                placeholder="e.g. M"
              />
            </div>
            <div>
              <Label className="text-xs">Color</Label>
              <Input
                {...register(`variants.${index}.color`)}
                placeholder="e.g. Red"
              />
            </div>
            <div>
              <Label className="text-xs">Stock</Label>
              <Input
                type="number"
                min="0"
                {...register(`variants.${index}.stock`)}
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs">SKU</Label>
                <Input
                  {...register(`variants.${index}.sku`)}
                  placeholder="SKU"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-5"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {errors.variants && (
          <p className="text-sm text-red-500">{errors.variants.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={isSubmitting}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
      </div>{/* end card */}
    </form>
  );
}
