//components\home\ServiceCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";

interface ServiceCardProps {
  service: {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    location: string;
    image: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const router = useRouter();

  return (
    <Link href={`/services/${service._id}`} className="group block">
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden h-full">
        <CardContent className="p-0">
          <div className="relative w-full h-40 bg-secondary rounded-t-lg overflow-hidden">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {service.description}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {service.duration}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {service.location}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                ${service.price}
              </span>
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/services/booking?service=${service._id}`);
                }}
              >
                Book Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}