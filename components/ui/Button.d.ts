declare module '@/components/ui/Button' {
  import * as React from "react";

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
    fullWidth?: boolean;
    children?: React.ReactNode;
  }

  const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
  
  export default Button;
  export { Button };
}
