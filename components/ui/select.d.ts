declare module '@/components/ui/select' {
  import * as React from "react";

  export interface SelectProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    name?: string;
    children?: React.ReactNode;
  }

  export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
  }

  export interface SelectValueProps {
    placeholder?: string;
    children?: React.ReactNode;
  }

  export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }

  export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
    children?: React.ReactNode;
  }

  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.ForwardRefExoticComponent<SelectTriggerProps & React.RefAttributes<HTMLButtonElement>>;
  export const SelectValue: React.FC<SelectValueProps>;
  export const SelectContent: React.ForwardRefExoticComponent<SelectContentProps & React.RefAttributes<HTMLDivElement>>;
  export const SelectItem: React.ForwardRefExoticComponent<SelectItemProps & React.RefAttributes<HTMLDivElement>>;
}
