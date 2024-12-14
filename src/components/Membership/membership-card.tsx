"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CreditCard, Cpu, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface MembershipCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  className?: string;
  disabled?: boolean;
  plan?: boolean;
  onSelect?: () => void;
}

export function MembershipCard({
  plan = true,
  title,
  price,
  description,
  features,
  popular,
  className,
  disabled,
  onSelect,
}: MembershipCardProps) {
  return (
    <Card
      className={twMerge(
        `w-full max-w-sm ${
          popular ? "border-primary" : ""
        }  bg-gradient-to-br h-[400px] from-gray-800 to-gray-900 text-white overflow-hidden transform transition-all duration-300 hover:scale-105`,
        className
      )}
    >
      <CardHeader className="relative">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          {popular && (
            <Badge
              variant="secondary"
              className="bg-yellow-400 text-gray-900 mt-10"
            >
              Most Popular
            </Badge>
          )}
        </div>
        <CardDescription className="text-xl font-semibold text-gray-300">
          ${price}/month
        </CardDescription>
        <Cpu className="absolute top-4 right-4 h-8 w-8 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-300">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      {plan && (
        <CardFooter>
          <Button
            onClick={onSelect}
            disabled={disabled}
            className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-500"
          >
            {popular ? "Upgrade Now" : "Select Plan"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
