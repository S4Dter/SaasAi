declare module '@/components/ui/input' {
  import * as React from "react";

  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
  }

  export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
}
