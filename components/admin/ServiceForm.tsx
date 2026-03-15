// components/admin/ServiceForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { PlusCircle, X, GripVertical } from "lucide-react";

const CATEGORIES = [
  { value: "personal-training", label: "Personal Training (1-on-1)" },
  { value: "group-class",       label: "Group Fitness Class" },
  { value: "facility-access",   label: "Facility Access" },
  { value: "assessment",        label: "Assessment / Orientation" },
  { value: "online-coaching",   label: "Online Coaching" },
];

const DURATIONS = ["30 min", "45 min", "60 min", "90 min", "2 hours", "Half day"];

// Default includes per category so new services start with sensible defaults
const CATEGORY_DEFAULTS: Record<string, string[]> = {
  "personal-training": [
    "1-on-1 coaching with a certified trainer",
    "Personalised workout plan",
    "Progress tracking & feedback",
    "Equipment guidance",
  ],
  "group-class": [
    "Group session with certified instructor",
    "All equipment provided",
    "Warm-up & cool-down included",
    "Suitable for all fitness levels",
  ],
  "facility-access": [
    "Full gym floor access",
    "Locker room & shower",
    "Free weights & machines",
    "Cardio equipment",
  ],
  "assessment": [
    "Full fitness assessment",
    "Body composition analysis",
    "Goal-setting consultation",
    "Written summary report",
  ],
  "online-coaching": [
    "Weekly personalised workout plan",
    "Nutrition guidance",
    "Video call check-ins",
    "24/7 messaging support",
  ],
};

const serviceSchema = z.object({
  name:        z.string().min(3, "Name must be at least 3 characters"),
  category:    z.enum(["personal-training", "group-class", "facility-access", "assessment", "online-coaching"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price:       z.coerce.number().min(0, "Price must be 0 or more"),
  duration:    z.string().min(1, "Duration is required"),
  capacity:    z.coerce.number().int().min(1, "Capacity must be at least 1"),
  location:    z.string().min(2, "Location is required"),
  image:       z.string().min(1, "Image is required"),
  isActive:    z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: any;
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  // Manage includes list locally — not part of zod since it's a string[]
  const [includes, setIncludes] = useState<string[]>(
    // For existing services: use saved includes (even if empty [])
    // For new services: pre-fill with category defaults
    initialData
      ? (Array.isArray(initialData.includes) ? initialData.includes : [])
      : CATEGORY_DEFAULTS["personal-training"]
  );
  const [newItem, setNewItem] = useState("");

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
      capacity:    initialData?.capacity    ?? 1,
      location:    initialData?.location    || "",
      image:       initialData?.image       || "",
      isActive:    initialData?.isActive    ?? true,
    },
  });

  const image    = watch("image");
  const isActive = watch("isActive");
  const category = watch("category");

  // When category changes on a NEW service, reset includes to category defaults
  const handleCategoryChange = (val: string) => {
    setValue("category", val as any);
    // Only auto-fill defaults when creating a new service, never when editing
    if (!initialData) {
      setIncludes(CATEGORY_DEFAULTS[val] || []);
    }
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setIncludes((prev) => [...prev, trimmed]);
    setNewItem("");
  };

  const removeItem = (i: number) => setIncludes((prev) => prev.filter((_, idx) => idx !== i));

  const updateItem = (i: number, val: string) =>
    setIncludes((prev) => prev.map((item, idx) => (idx === i ? val : item)));

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const url    = initialData ? "/api/services" : "/api/services";
      const method = initialData ? "PUT" : "POST";
      const body   = initialData
        ? { id: initialData._id, ...data, includes }
        : { ...data, includes };

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
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
          <Select value={watch("duration")} onValueChange={(v) => setValue("duration", v)}>
            <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
            <SelectContent>
              {DURATIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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

      {/* What's Included */}
      <div className="space-y-3">
        <div>
          <Label>What&apos;s Included</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            These bullet points appear on the service detail page.
          </p>
        </div>

        {/* Existing items */}
        <div className="space-y-2">
          {includes.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                className="flex-1 h-8 text-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                onClick={() => removeItem(i)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
            placeholder="Add an included item..."
            className="flex-1 h-8 text-sm"
          />
          <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8 gap-1">
            <PlusCircle className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>

        {includes.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
            No items added yet.{" "}
            {initialData
              ? "Add items above and click \"Update Service\" to show this section on the detail page."
              : "The \"What's included\" section will be hidden on the detail page until you add items."}
          </div>
        )}
      </div>

      {/* Active toggle */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div>
          <p className="font-medium text-sm">Service Availability</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            When disabled, this service is hidden from users.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => setValue("isActive", !isActive, { shouldValidate: true })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            isActive ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground -mt-4">
        Status:{" "}
        <span className={isActive ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
          {isActive ? "Active — visible to users" : "Inactive — hidden from users"}
        </span>
      </p>

      {/* Image Upload */}
      <div>
        <Label>Service Image <span className="text-red-500">*</span></Label>
        <input type="hidden" {...register("image")} />
        <div className="mt-2">
          {image ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
              <Image src={image} alt="Service preview" fill className="object-cover" />
              <Button
                type="button" variant="destructive" size="sm"
                className="absolute top-2 right-2 h-7 w-7 p-0"
                onClick={() => setValue("image", "", { shouldValidate: true })}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_PRODUCTS!}
              onSuccess={(result: any) => setValue("image", result.info.secure_url, { shouldValidate: true })}
              options={{ maxFiles: 1, clientAllowedFormats: ["image"] }}
            >
              {({ open }) => (
                <Button type="button" variant="outline"
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
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
