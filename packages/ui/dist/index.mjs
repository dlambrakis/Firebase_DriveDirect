"use client"

// src/components/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/button.tsx
import { jsx } from "react/jsx-runtime";
var buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

// src/components/card.tsx
import * as React2 from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var Card = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
var CardHeader = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
var CardDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/components/input.tsx
import * as React3 from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var Input = React3.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx3(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

// src/components/label.tsx
import * as React4 from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx4 } from "react/jsx-runtime";
var labelVariants = cva2(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label.displayName = LabelPrimitive.Root.displayName;

// src/components/textarea.tsx
import * as React5 from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Textarea = React5.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx5(
      "textarea",
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";

// src/components/select.tsx
import * as React6 from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { jsx as jsx6, jsxs } from "react/jsx-runtime";
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React6.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx6(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx6(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx6(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx6(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React6.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx6(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx6(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx6(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx6(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React6.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx6("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx6(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx6(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx6(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// src/components/alert-dialog.tsx
import * as React7 from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
var AlertDialogContent = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs2(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx7(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx7(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
var AlertDialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx7(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx7(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    ),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

// src/components/badge.tsx
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
var badgeVariants = cva3(
  "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx8("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/tooltip.tsx
import * as React8 from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { jsx as jsx9 } from "react/jsx-runtime";
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React8.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx9(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// src/components/MultiSelect.tsx
import * as React9 from "react";
import { Check as Check2, ChevronsUpDown, X } from "lucide-react";
import { jsx as jsx10, jsxs as jsxs3 } from "react/jsx-runtime";
var MultiSelect = ({
  options,
  selected,
  onChange,
  className,
  placeholder,
  label,
  disabled
}) => {
  const [open, setOpen] = React9.useState(false);
  const [searchTerm, setSearchTerm] = React9.useState("");
  const wrapperRef = React9.useRef(null);
  React9.useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  const handleSelect = (value) => {
    if (disabled) return;
    const newSelected = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
    onChange(newSelected);
  };
  const filteredOptions = options.filter(
    (option) => option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsxs3("div", { className: cn("space-y-1.5", className), ref: wrapperRef, children: [
    label && /* @__PURE__ */ jsx10(Label, { className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: label }),
    /* @__PURE__ */ jsxs3("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs3(
        Button,
        {
          type: "button",
          variant: "outline",
          role: "combobox",
          "aria-expanded": open,
          className: "w-full justify-between h-auto min-h-10",
          onClick: () => !disabled && setOpen(!open),
          disabled,
          children: [
            /* @__PURE__ */ jsx10("div", { className: "flex gap-1 flex-wrap", children: selected.length > 0 ? options.filter((option) => selected.includes(option.value)).map((option) => /* @__PURE__ */ jsxs3(
              Badge,
              {
                variant: "secondary",
                className: "mr-1 mb-1",
                onClick: (e) => {
                  e.stopPropagation();
                  handleSelect(option.value);
                },
                children: [
                  option.label,
                  /* @__PURE__ */ jsx10(
                    "button",
                    {
                      className: "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleSelect(option.value);
                      },
                      children: /* @__PURE__ */ jsx10(X, { className: "h-3 w-3 text-muted-foreground hover:text-foreground" })
                    }
                  )
                ]
              },
              option.value
            )) : /* @__PURE__ */ jsx10("span", { className: "text-muted-foreground", children: placeholder ?? "Select options..." }) }),
            /* @__PURE__ */ jsx10(ChevronsUpDown, { className: "h-4 w-4 shrink-0 opacity-50" })
          ]
        }
      ),
      open && !disabled && /* @__PURE__ */ jsxs3("div", { className: "absolute z-50 top-full mt-1 w-full rounded-md border bg-white text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95", children: [
        /* @__PURE__ */ jsx10("div", { className: "p-2", children: /* @__PURE__ */ jsx10(
          Input,
          {
            type: "text",
            placeholder: "Search...",
            className: "w-full",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            autoFocus: true
          }
        ) }),
        /* @__PURE__ */ jsx10("ul", { className: "max-h-80 overflow-auto p-1", children: filteredOptions.length > 0 ? filteredOptions.map((option) => /* @__PURE__ */ jsxs3(
          "li",
          {
            className: cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            ),
            onClick: () => handleSelect(option.value),
            children: [
              /* @__PURE__ */ jsx10("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: selected.includes(option.value) && /* @__PURE__ */ jsx10(Check2, { className: "h-4 w-4" }) }),
              option.label
            ]
          },
          option.value
        )) : /* @__PURE__ */ jsx10("li", { className: "relative flex cursor-default select-none items-center justify-center py-1.5 px-2 text-sm text-muted-foreground", children: "No results found." }) })
      ] })
    ] })
  ] });
};

// src/components/sonner.tsx
import { Toaster as Sonner } from "sonner";
import { jsx as jsx11 } from "react/jsx-runtime";
var Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx11(
    Sonner,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};

// src/components/Dropzone.web.tsx
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { jsx as jsx12, jsxs as jsxs4 } from "react/jsx-runtime";
var Dropzone = ({ onDrop, className, children, ...options }) => {
  const onDropCallback = useCallback((acceptedFiles, fileRejections) => {
    onDrop(acceptedFiles, fileRejections);
  }, [onDrop]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    ...options
  });
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      ...getRootProps(),
      className: cn(
        "flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-input p-8 text-center transition-colors",
        isDragActive ? "border-primary bg-muted" : "hover:border-primary/50",
        className
      ),
      children: [
        /* @__PURE__ */ jsx12("input", { ...getInputProps() }),
        children ? children : isDragActive ? /* @__PURE__ */ jsx12("p", { children: "Drop the files here ..." }) : /* @__PURE__ */ jsx12("p", { children: "Drag 'n' drop some files here, or click to select files" })
      ]
    }
  );
};

// src/components/MyListingCard.web.tsx
import { Link } from "react-router-dom";
import { formatPrice, formatMileage } from "@directdrive/utils";
import { Edit, Trash2, Eye, Tag, RotateCcw } from "lucide-react";
import { jsx as jsx13, jsxs as jsxs5 } from "react/jsx-runtime";
var MyListingCard = ({
  listing,
  onDelete,
  isDeleting,
  onUpdateStatus,
  isUpdatingStatus
}) => {
  const isSold = listing.status === "SOLD";
  const handleUpdateStatus = (status) => {
    if (listing.listing_id === null) return;
    onUpdateStatus(listing.listing_id, status);
  };
  const handleDelete = () => {
    if (listing.listing_id === null) return;
    onDelete(listing.listing_id);
  };
  return /* @__PURE__ */ jsxs5(Card, { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxs5(CardHeader, { children: [
      /* @__PURE__ */ jsxs5("div", { className: "relative aspect-w-16 aspect-h-9 mb-4", children: [
        /* @__PURE__ */ jsx13(
          "img",
          {
            src: listing.images?.[0] || "https://placehold.co/600x400/EEE/31343C?text=No+Image",
            alt: `${listing.make} ${listing.model}`,
            className: `object-cover w-full h-full rounded-md ${isSold ? "opacity-50" : ""}`
          }
        ),
        isSold && /* @__PURE__ */ jsx13("div", { className: "absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md", children: /* @__PURE__ */ jsx13(
          Badge,
          {
            variant: "destructive",
            className: "text-lg font-bold px-6 py-2 transform -rotate-12",
            children: "SOLD"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx13(CardTitle, { className: "text-xl", children: `${listing.year} ${listing.make} ${listing.model}` })
    ] }),
    /* @__PURE__ */ jsxs5(CardContent, { className: "flex-grow", children: [
      /* @__PURE__ */ jsx13("p", { className: "text-2xl font-semibold text-primary mb-2", children: formatPrice(listing.price ?? 0) }),
      /* @__PURE__ */ jsx13("p", { className: "text-sm text-muted-foreground", children: formatMileage(listing.mileage ?? 0) })
    ] }),
    /* @__PURE__ */ jsxs5(CardFooter, { className: "flex flex-wrap justify-end gap-2", children: [
      /* @__PURE__ */ jsx13(Button, { variant: "ghost", size: "sm", asChild: true, disabled: !listing.listing_id, children: /* @__PURE__ */ jsxs5(Link, { to: `/vehicle/${listing.listing_id}`, children: [
        /* @__PURE__ */ jsx13(Eye, { className: "mr-2 h-4 w-4" }),
        " View"
      ] }) }),
      isSold ? /* @__PURE__ */ jsxs5(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => handleUpdateStatus("AVAILABLE"),
          disabled: isUpdatingStatus || !listing.listing_id,
          children: [
            /* @__PURE__ */ jsx13(RotateCcw, { className: "mr-2 h-4 w-4" }),
            isUpdatingStatus ? "Updating..." : "Mark as Available"
          ]
        }
      ) : /* @__PURE__ */ jsxs5(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => handleUpdateStatus("SOLD"),
          disabled: isUpdatingStatus || isDeleting || !listing.listing_id,
          children: [
            /* @__PURE__ */ jsx13(Tag, { className: "mr-2 h-4 w-4" }),
            isUpdatingStatus ? "Updating..." : "Mark as Sold"
          ]
        }
      ),
      /* @__PURE__ */ jsx13(
        Button,
        {
          variant: "outline",
          size: "sm",
          asChild: true,
          disabled: isSold || isUpdatingStatus || !listing.listing_id,
          children: /* @__PURE__ */ jsxs5(Link, { to: `/edit-listing/${listing.listing_id}`, children: [
            /* @__PURE__ */ jsx13(Edit, { className: "mr-2 h-4 w-4" }),
            " Edit"
          ] })
        }
      ),
      /* @__PURE__ */ jsxs5(AlertDialog, { children: [
        /* @__PURE__ */ jsx13(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs5(
          Button,
          {
            variant: "destructive",
            size: "sm",
            disabled: isDeleting || isSold || isUpdatingStatus || !listing.listing_id,
            children: [
              /* @__PURE__ */ jsx13(Trash2, { className: "mr-2 h-4 w-4" }),
              " ",
              isDeleting ? "Deleting..." : "Delete"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs5(AlertDialogContent, { children: [
          /* @__PURE__ */ jsxs5(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsx13(AlertDialogTitle, { children: "Are you absolutely sure?" }),
            /* @__PURE__ */ jsx13(AlertDialogDescription, { children: "This action cannot be undone. This will permanently delete your listing and remove all associated data from our servers." })
          ] }),
          /* @__PURE__ */ jsxs5(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsx13(AlertDialogCancel, { children: "Cancel" }),
            /* @__PURE__ */ jsx13(AlertDialogAction, { onClick: handleDelete, disabled: isDeleting, children: "Continue" })
          ] })
        ] })
      ] })
    ] })
  ] });
};

// src/components/OfferModal.web.tsx
import { useState as useState2, useEffect as useEffect2 } from "react";

// src/components/dialog.tsx
import * as React11 from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X as X2 } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs6 } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React11.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs6(DialogPortal, { children: [
  /* @__PURE__ */ jsx14(DialogOverlay, {}),
  /* @__PURE__ */ jsxs6(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs6(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx14(X2, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx14("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx14(
  "div",
  {
    className: cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    ),
    ...props
  }
);
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx14(
  "div",
  {
    className: cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    ),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
  DialogPrimitive.Title,
  {
    ref,
    className: cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx14(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/components/OfferModal.web.tsx
import { Loader2 } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs7 } from "react/jsx-runtime";
var OfferModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  title,
  description,
  initialAmount = 0,
  submitButtonText = "Submit Offer"
}) => {
  const [amount, setAmount] = useState2(initialAmount.toString());
  const [error, setError] = useState2(null);
  useEffect2(() => {
    if (isOpen) {
      setAmount(initialAmount > 0 ? initialAmount.toString() : "");
      setError(null);
    }
  }, [isOpen, initialAmount]);
  const handleSubmit = () => {
    setError(null);
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    onSubmit(numericAmount);
  };
  return /* @__PURE__ */ jsx15(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxs7(DialogContent, { className: "sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsxs7(DialogHeader, { children: [
      /* @__PURE__ */ jsx15(DialogTitle, { children: title }),
      /* @__PURE__ */ jsx15(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "grid gap-4 py-4", children: [
      /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-4 items-center gap-4", children: [
        /* @__PURE__ */ jsx15(Label, { htmlFor: "amount", className: "text-right", children: "Amount (ZAR)" }),
        /* @__PURE__ */ jsx15(
          Input,
          {
            id: "amount",
            type: "number",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            className: "col-span-3",
            placeholder: "e.g., 150000"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx15("p", { className: "col-span-4 text-red-500 text-sm text-center pt-2", children: error })
    ] }),
    /* @__PURE__ */ jsxs7(DialogFooter, { children: [
      /* @__PURE__ */ jsx15(Button, { variant: "outline", onClick: onClose, disabled: isSubmitting, children: "Cancel" }),
      /* @__PURE__ */ jsxs7(Button, { onClick: handleSubmit, disabled: isSubmitting, children: [
        isSubmitting ? /* @__PURE__ */ jsx15(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
        submitButtonText
      ] })
    ] })
  ] }) });
};

// src/components/VehicleCard.web.tsx
import { Tag as Tag2, Fuel, Gauge, GitMerge, MapPin, Heart } from "lucide-react";
import { useAuth } from "@directdrive/hooks";
import { useFetchSavedVehicleListings, useToggleSaveVehicle } from "@directdrive/hooks";
import { formatPrice as formatPrice2, formatMileage as formatMileage2 } from "@directdrive/utils";
import { jsx as jsx16, jsxs as jsxs8 } from "react/jsx-runtime";
var InfoItem = ({ icon: Icon2, label }) => /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 text-sm text-textSecondary", children: [
  /* @__PURE__ */ jsx16(Icon2, { size: 16, className: "text-primary" }),
  /* @__PURE__ */ jsx16("span", { children: label })
] });
var VehicleCard = ({ vehicle, LinkComponent, viewMode = "grid" }) => {
  const { user } = useAuth();
  const { data: savedVehicles } = useFetchSavedVehicleListings(user?.id);
  const { mutate: toggleSave, isPending: isTogglingSave } = useToggleSaveVehicle();
  if (!vehicle || vehicle.listing_id === null) {
    return null;
  }
  const isSaved = savedVehicles?.has(vehicle.listing_id) || false;
  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleSave({
        listingId: vehicle.listing_id,
        isSaved
      });
    }
  };
  const SaveButton = () => /* @__PURE__ */ jsx16(TooltipProvider, { delayDuration: 200, children: /* @__PURE__ */ jsxs8(Tooltip, { children: [
    /* @__PURE__ */ jsx16(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx16(
      Button,
      {
        size: "icon",
        variant: "ghost",
        className: "absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-10",
        onClick: handleSaveClick,
        disabled: !user || isTogglingSave,
        "aria-label": isSaved ? "Unsave vehicle" : "Save vehicle",
        children: /* @__PURE__ */ jsx16(Heart, { size: 20, className: isSaved ? "fill-red-500 text-red-500" : "text-white" })
      }
    ) }),
    !user && /* @__PURE__ */ jsx16(TooltipContent, { children: /* @__PURE__ */ jsx16("p", { children: "Log in to save vehicles" }) })
  ] }) });
  if (viewMode === "list") {
    return /* @__PURE__ */ jsx16(LinkComponent, { to: `/vehicle/${vehicle.listing_id}`, className: "block bg-backgroundSecondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300", children: /* @__PURE__ */ jsxs8("div", { className: "flex", children: [
      /* @__PURE__ */ jsxs8("div", { className: "w-1/3 relative", children: [
        /* @__PURE__ */ jsx16(
          "img",
          {
            src: vehicle.images?.[0] || "https://placehold.co/400x300/1a1a1a/ffffff?text=No+Image",
            alt: `${vehicle.make} ${vehicle.model}`,
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx16(SaveButton, {})
      ] }),
      /* @__PURE__ */ jsx16("div", { className: "w-2/3 p-6 flex flex-col justify-between", children: /* @__PURE__ */ jsxs8("div", { children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxs8("h3", { className: "text-xl font-bold text-white", children: [
            vehicle.year,
            " ",
            vehicle.make,
            " ",
            vehicle.model
          ] }),
          /* @__PURE__ */ jsx16("p", { className: "text-xl font-semibold text-primary", children: formatPrice2(vehicle.price ?? 0) })
        ] }),
        /* @__PURE__ */ jsx16("p", { className: "text-sm text-textSecondary mb-4", children: vehicle.variant }),
        /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2 mt-2", children: [
          /* @__PURE__ */ jsx16(InfoItem, { icon: Gauge, label: formatMileage2(vehicle.mileage ?? 0) }),
          /* @__PURE__ */ jsx16(InfoItem, { icon: GitMerge, label: vehicle.transmission }),
          /* @__PURE__ */ jsx16(InfoItem, { icon: Fuel, label: vehicle.fuel_type }),
          /* @__PURE__ */ jsx16(InfoItem, { icon: MapPin, label: vehicle.location })
        ] })
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs8(LinkComponent, { to: `/vehicle/${vehicle.listing_id}`, className: "block bg-backgroundSecondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group", children: [
    /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
      /* @__PURE__ */ jsx16(
        "img",
        {
          src: vehicle.images?.[0] || "https://placehold.co/400x300/1a1a1a/ffffff?text=No+Image",
          alt: `${vehicle.make} ${vehicle.model}`,
          className: "w-full h-48 object-cover"
        }
      ),
      /* @__PURE__ */ jsx16(SaveButton, {}),
      /* @__PURE__ */ jsxs8("div", { className: "absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-4", children: [
        /* @__PURE__ */ jsxs8("h3", { className: "text-lg font-bold text-white", children: [
          vehicle.year,
          " ",
          vehicle.make,
          " ",
          vehicle.model
        ] }),
        /* @__PURE__ */ jsx16("p", { className: "text-sm text-gray-300 truncate", children: vehicle.variant })
      ] })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex justify-between items-center mb-4", children: [
        /* @__PURE__ */ jsx16("p", { className: "text-lg font-semibold text-primary", children: formatPrice2(vehicle.price ?? 0) }),
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2 text-sm text-textSecondary", children: [
          /* @__PURE__ */ jsx16(Tag2, { size: 16, className: "text-primary" }),
          /* @__PURE__ */ jsx16("span", { children: vehicle.body_type })
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-2 gap-x-4 gap-y-2", children: [
        /* @__PURE__ */ jsx16(InfoItem, { icon: Gauge, label: formatMileage2(vehicle.mileage ?? 0) }),
        /* @__PURE__ */ jsx16(InfoItem, { icon: GitMerge, label: vehicle.transmission }),
        /* @__PURE__ */ jsx16(InfoItem, { icon: Fuel, label: vehicle.fuel_type }),
        /* @__PURE__ */ jsx16(InfoItem, { icon: MapPin, label: vehicle.location })
      ] })
    ] })
  ] });
};
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dropzone,
  Input,
  Label,
  MultiSelect,
  MyListingCard,
  OfferModal,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Textarea,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  VehicleCard,
  badgeVariants,
  buttonVariants
};
//# sourceMappingURL=index.mjs.map