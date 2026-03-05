// components/admin/ServiceForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { PlusCircle, X } from "lucide-react";

const CATEGORIES = [
  { value: "personal-training",  label: "Personal Training (1-on-1)" },
  { value: "group-class",        label: "Group Fitness Class" },
  { value: "facility-access",    label: "Facility Access" },
  { value: "assessment",         label: "Assessment / Orientation" },
  { value: "online-coaching",    label: "Online Coaching" },
];

const DURATIONS = [
  "30 min", "45 min", "60 min", "90 min", "2 hours", "Half day",
];

const serviceSchema = z.object({
  name:        z.string().min(3, "Name must be at least 3 characters"),
  category:    z.enum(["personal-training", "group-class", "facility-access", "assessment", "online-coaching"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price:       z.coerce.number().min(0, "Price must be 0 or more"),
  duration:    z.string().min(1, "Duration is required"),
  capacity:    z.coerce.number().int().min(1, "Capacity must be at least 1"),
  location:    z.string().min(2, "Location is required"),
  image:       z.string().min(1, "Image is required"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: any;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name:        initialData?.name        || "",
      category:    initialData?.category    || "personal-training",
      description: initialData?.description || "",
      price:       initialData?.price       || undefined,
      duration:    initialData?.duration    || "",
      capacity:    initialData?.capacity ?? 1,
      location:    initialData?.location    || "",
      image:       initialData?.image       || "",
    },
  });

  const image = watch("image");

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const url    = initialData ? `/api/services` : "/api/services";
      const method = initialData ? "PUT" : "POST";
      const body   = initialData ? { id: initialData._id, ...data } : data;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save service");
      }

      toast({
        title: "Success",
        description: `Service ${initialData ? "updated" : "created"} successfully.`,
      });

      router.push("/admin");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">
        {initialData ? "Edit Service" : "Add New Service"}
      </h1>

      {/* Name */}
      <div>
        <Label htmlFor="name">Service Name</Label>
        <Input id="name" {...register("name")} placeholder="e.g. Personal Training Session" />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div>
        <Label>Category</Label>
        <Select
          value={watch("category")}
          onValueChange={(v) => setValue("category", v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")}
          placeholder="Describe what this service includes, who it's for, what to expect..." />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* Price + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" min="0" {...register("price")} />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>
        <div>
          <Label>Duration</Label>
          <Select
            value={watch("duration")}
            onValueChange={(v) => setValue("duration", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATIONS.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
        </div>
      </div>

      {/* Capacity + Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" min="1" {...register("capacity")}
            placeholder="1 for PT, 20 for group class" />
          {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")}
            placeholder="e.g. Room 1, Main Floor, Online" />
          {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <Label>
          Service Image <span className="text-red-500">*</span>
        </Label>
        <input type="hidden" {...register("image")} />
        <div className="mt-2">
          {image ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
              <Image src={image} alt="Service preview" fill className="object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-7 w-7 p-0"
                onClick={() => setValue("image", "", { shouldValidate: true })}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_PRODUCTS!}
              onSuccess={(result: any) => {
                setValue("image", result.info.secure_url, { shouldValidate: true });
              }}
              options={{ maxFiles: 1, clientAllowedFormats: ["image"] }}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 flex flex-col gap-2 border-dashed"
                  onClick={() => open?.()}
                >
                  <PlusCircle className="w-6 h-6" />
                  <span className="text-sm">Upload Image</span>
                </Button>
              )}
            </CldUploadWidget>
          )}
        </div>
        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}