"use client";
import { useEffect } from "react";
import { toast } from "sonner";

type PopContainerProps = {
  title: string;
  description?: string;
  btnTitle: string;
  action: () => void;
};
export default function usePopContainer(
  open: boolean,
  { title, description, btnTitle, action }: PopContainerProps
) {
  const popUp = () => {
    toast(title, {
      description: description,
      duration: 300000,
      action: {
        label: btnTitle,
        onClick: action,
      },
    });
  };

  useEffect(() => {
    if (open) {
      popUp();
    }
  }, [open]);
  return { popUp };
}
