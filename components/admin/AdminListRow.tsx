"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

interface AdminListRowProps {
  id: string;
  name: string;
  metadata: string;
  isActive?: boolean;
  hasToggle?: boolean;
  editUrl: string;
  viewUrl?: string;
  onEdit?: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleActive?: (id: string) => void;
}

export function AdminListRow({
  id,
  name,
  metadata,
  isActive,
  hasToggle = false,
  editUrl,
  viewUrl,
  onDelete,
  onToggleActive,
}: AdminListRowProps) {
  return (
    <Card className={`athletic-card border-border/50 overflow-hidden transition-colors ${hasToggle && !isActive ? "bg-card/40 border-dashed" : "hover:border-primary/50"}`}>
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="font-semibold">{name}</p>
            {hasToggle && isActive !== undefined && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                isActive
                  ? "bg-[#FF531A]/10 text-[#FF531A] border-[#FF531A]/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}>
                {isActive ? "Active" : "Hidden"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{metadata}</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {viewUrl && (
            <Link href={viewUrl}>
              <Button size="sm" variant="outline" title="View page">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
          )}
          {hasToggle && onToggleActive && (
            <Button
              size="sm"
              variant="outline"
              title={isActive ? "Hide from users" : "Show to users"}
              onClick={() => onToggleActive(id)}
              className={isActive ? "text-[#FF531A] border-[#FF531A]/30 hover:bg-[#FF531A]/10 hover:text-[#FF531A] hover:border-[#FF531A]/30 cursor-pointer" : "text-red-500 border-red-500/30 hover:bg-red-500/10 cursor-pointer"}
            >
              {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </Button>
          )}
          <Link href={editUrl}>
            <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
          </Link>
          <DeleteButton id={id} onDelete={handleDeleteWrapper} />
        </div>
      </CardContent>
    </Card>
  );

  function handleDeleteWrapper() {
    return onDelete(id);
  }
}
