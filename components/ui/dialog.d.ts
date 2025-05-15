declare module '@/components/ui/dialog' {
  import * as React from "react";

  export interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
  }

  export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }

  export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }

  export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
  }

  export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children?: React.ReactNode;
  }

  export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
    children?: React.ReactNode;
  }

  export const Dialog: React.FC<DialogProps>;
  export const DialogContent: React.ForwardRefExoticComponent<DialogContentProps>;
  export const DialogHeader: React.FC<DialogHeaderProps>;
  export const DialogFooter: React.FC<DialogFooterProps>;
  export const DialogTitle: React.ForwardRefExoticComponent<DialogTitleProps>;
  export const DialogDescription: React.ForwardRefExoticComponent<DialogDescriptionProps>;
  export const DialogTrigger: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<"button">>;
  export const DialogClose: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<"button">>;
}
