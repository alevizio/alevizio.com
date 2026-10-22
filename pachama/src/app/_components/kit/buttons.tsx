import { ChevronDown, ChevronRight, Download } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../cn";
import { UI } from "./ui";

type Variant = "action" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  action: "bg-linear-to-r from-[#43b96c] to-[#13adb1] text-white hover:brightness-105",
  dark: "bg-[#1d2422] text-white hover:bg-[#2c3532]",
  outline: "border border-[#cfd5d2] bg-white text-[#141a17] hover:border-[#141a17]",
  ghost: "text-[#141a17] hover:bg-[#eef1ef]",
};

const SIZE: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px]",
  md: "h-10 gap-2 px-4 text-[15px]",
  lg: "h-12 gap-2 px-6 text-base",
};

/** The product's button: four looks, three sizes. */
export const KitButton = ({
  variant = "action",
  size = "md",
  disabled = false,
  onClick,
  children,
  className,
}: {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center rounded-[8px] font-medium transition disabled:cursor-not-allowed disabled:opacity-40",
      UI.focus,
      VARIANT[variant],
      SIZE[size],
      className,
    )}
  >
    {children}
  </button>
);

const Label = ({ children }: { children: string }) => <p className={cn(UI.label, "mb-3")}>{children}</p>;

/** Every variant, every size, and the disabled state. */
export const ButtonSet = () => (
  <div className={cn(UI.card, "grid gap-8 p-6 sm:p-8")}>
    <div>
      <Label>Variants</Label>
      <div className="flex flex-wrap items-center gap-3">
        <KitButton>Buy now</KitButton>
        <KitButton variant="dark">Explore projects</KitButton>
        <KitButton variant="outline">
          Visit project page <ChevronRight aria-hidden className="size-4" />
        </KitButton>
        <KitButton variant="ghost">Cancel</KitButton>
      </div>
    </div>
    <div>
      <Label>Sizes</Label>
      <div className="flex flex-wrap items-center gap-3">
        <KitButton size="sm" variant="dark">
          Download full report <ChevronDown aria-hidden className="size-3.5" />
        </KitButton>
        <KitButton size="md" variant="dark">
          <Download aria-hidden className="size-4" /> Download
        </KitButton>
        <KitButton size="lg">Act now</KitButton>
      </div>
    </div>
    <div>
      <Label>Disabled</Label>
      <div className="flex flex-wrap items-center gap-3">
        <KitButton disabled>Buy now</KitButton>
        <KitButton disabled variant="outline">
          Visit project page
        </KitButton>
      </div>
    </div>
  </div>
);
