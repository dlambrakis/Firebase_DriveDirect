"use client"

// src/components/alert-dialog.tsx
import * as React2 from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/button.tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
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

// src/components/alert-dialog.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var AlertDialog = AlertDialogPrimitive.Root;
var AlertDialogTrigger = AlertDialogPrimitive.Trigger;
var AlertDialogPortal = AlertDialogPrimitive.Portal;
var AlertDialogOverlay = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
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
var AlertDialogContent = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx2(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx2(
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
}) => /* @__PURE__ */ jsx2(
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
}) => /* @__PURE__ */ jsx2(
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
var AlertDialogTitle = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
var AlertDialogDescription = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
var AlertDialogAction = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
  AlertDialogPrimitive.Action,
  {
    ref,
    className: cn(buttonVariants(), className),
    ...props
  }
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
var AlertDialogCancel = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx2(
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
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx3 } from "react/jsx-runtime";
var badgeVariants = cva2(
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
  return /* @__PURE__ */ jsx3("div", { className: cn(badgeVariants({ variant }), className), ...props });
}

// src/components/card.tsx
import * as React3 from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
var Card = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
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
var CardHeader = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
var CardTitle = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
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
var CardDescription = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
var CardContent = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
var CardFooter = React3.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx4(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

// src/components/Checkbox.tsx
import * as React4 from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Checkbox = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx5(
  CheckboxPrimitive.Root,
  {
    ref,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx5(
      CheckboxPrimitive.Indicator,
      {
        className: cn("flex items-center justify-center text-current"),
        children: /* @__PURE__ */ jsx5(Check, { className: "h-4 w-4" })
      }
    )
  }
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// src/components/dialog.tsx
import * as React5 from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
var Dialog = DialogPrimitive.Root;
var DialogTrigger = DialogPrimitive.Trigger;
var DialogPortal = DialogPrimitive.Portal;
var DialogClose = DialogPrimitive.Close;
var DialogOverlay = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
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
var DialogContent = React5.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs2(DialogPortal, { children: [
  /* @__PURE__ */ jsx6(DialogOverlay, {}),
  /* @__PURE__ */ jsxs2(
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
        /* @__PURE__ */ jsxs2(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx6(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx6("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
var DialogHeader = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx6(
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
}) => /* @__PURE__ */ jsx6(
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
var DialogTitle = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
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
var DialogDescription = React5.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// src/components/DropdownMenu.tsx
import * as React6 from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check as Check2, ChevronRight, Circle } from "lucide-react";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
var DropdownMenuGroup = DropdownMenuPrimitive.Group;
var DropdownMenuPortal = DropdownMenuPrimitive.Portal;
var DropdownMenuSub = DropdownMenuPrimitive.Sub;
var DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React6.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs3(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx7(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React6.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx7(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx7(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React6.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx7(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React6.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs3(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx7("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx7(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx7(Check2, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React6.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs3(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx7("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx7(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx7(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React6.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx7(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React6.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx7(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx7(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// src/components/Dropzone.web.tsx
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
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
        /* @__PURE__ */ jsx8("input", { ...getInputProps() }),
        children ? children : isDragActive ? /* @__PURE__ */ jsx8("p", { children: "Drop the files here ..." }) : /* @__PURE__ */ jsx8("p", { children: "Drag 'n' drop some files here, or click to select files" })
      ]
    }
  );
};

// src/components/ImageCarousel.native.tsx
import { useState, useRef, useCallback as useCallback2 } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Colors, Spacing } from "@directdrive/theme";
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
var { width } = Dimensions.get("window");
var THUMBNAIL_SIZE = 60;
var THUMBNAIL_SPACING = 10;
var styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundMuted
  },
  mainList: {
    height: width * 0.7
  },
  mainImage: {
    width,
    height: width * 0.7
  },
  thumbListContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: Spacing.sm,
    marginRight: THUMBNAIL_SPACING,
    opacity: 0.6
  },
  activeThumbnail: {
    opacity: 1,
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT
  }
});

// src/components/ImageCarousel.web.tsx
import { useState as useState2, useEffect, useCallback as useCallback3 } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight as ChevronRight2 } from "lucide-react";
import { Fragment, jsx as jsx10, jsxs as jsxs6 } from "react/jsx-runtime";

// src/components/input.tsx
import * as React10 from "react";
import { jsx as jsx11 } from "react/jsx-runtime";
var Input = React10.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx11(
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
import * as React11 from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva as cva3 } from "class-variance-authority";
import { jsx as jsx12 } from "react/jsx-runtime";
var labelVariants = cva3(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label2 = React11.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx12(
  LabelPrimitive.Root,
  {
    ref,
    className: cn(labelVariants(), className),
    ...props
  }
));
Label2.displayName = LabelPrimitive.Root.displayName;

// src/components/MyListingCard.native.tsx
import { View as View2, Text, StyleSheet as StyleSheet2, Image as Image2, Pressable, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { formatPrice, formatMileage } from "@directdrive/utils";
import { Colors as Colors2, Spacing as Spacing2, Typography, Borders } from "@directdrive/theme";
import { Eye, Edit, Trash2, Tag, RotateCcw } from "lucide-react-native";
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
var styles2 = StyleSheet2.create({
  card: {
    backgroundColor: Colors2.white,
    borderRadius: Borders.radius.lg,
    marginBottom: Spacing2.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors2.border
  },
  imageContainer: {
    position: "relative"
  },
  image: {
    width: "100%",
    height: 200
  },
  soldImage: {
    opacity: 0.5
  },
  soldBadge: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -20 }, { rotate: "-15deg" }],
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: Spacing2.lg,
    paddingVertical: Spacing2.sm,
    borderRadius: Borders.radius.md
  },
  soldBadgeText: {
    ...Typography.heading.h4,
    color: Colors2.white,
    fontWeight: "bold"
  },
  contentContainer: {
    padding: Spacing2.md
  },
  title: {
    ...Typography.heading.h5,
    color: Colors2.text.primary,
    marginBottom: Spacing2.sm
  },
  price: {
    ...Typography.heading.h4,
    color: Colors2.primary.DEFAULT,
    marginBottom: Spacing2.xs
  },
  mileage: {
    ...Typography.body.md,
    color: Colors2.text.secondary
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: Spacing2.md,
    paddingVertical: Spacing2.sm,
    borderTopWidth: 1,
    borderTopColor: Colors2.border
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing2.sm
  },
  actionButtonPressed: {
    opacity: 0.6
  },
  actionButtonText: {
    ...Typography.body.sm,
    marginLeft: Spacing2.sm,
    fontWeight: "600"
  }
});

// src/components/MyListingCard.web.tsx
import { Link } from "react-router-dom";
import { formatPrice as formatPrice2, formatMileage as formatMileage2 } from "@directdrive/utils";
import { Edit as Edit2, Trash2 as Trash22, Eye as Eye2, Tag as Tag2, RotateCcw as RotateCcw2 } from "lucide-react";
import { jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";

// src/components/MultiSelect.tsx
import * as React12 from "react";
import { Check as Check3, ChevronsUpDown, X as X2 } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
var MultiSelect = ({
  options,
  selected,
  onChange,
  className,
  placeholder,
  label,
  disabled
}) => {
  const [open, setOpen] = React12.useState(false);
  const [searchTerm, setSearchTerm] = React12.useState("");
  const wrapperRef = React12.useRef(null);
  React12.useEffect(() => {
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
  return /* @__PURE__ */ jsxs9("div", { className: cn("space-y-1.5", className), ref: wrapperRef, children: [
    label && /* @__PURE__ */ jsx15(Label2, { className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: label }),
    /* @__PURE__ */ jsxs9("div", { className: "relative", children: [
      /* @__PURE__ */ jsxs9(
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
            /* @__PURE__ */ jsx15("div", { className: "flex gap-1 flex-wrap", children: selected.length > 0 ? options.filter((option) => selected.includes(option.value)).map((option) => /* @__PURE__ */ jsxs9(
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
                  /* @__PURE__ */ jsx15(
                    "button",
                    {
                      className: "ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      onClick: (e) => {
                        e.stopPropagation();
                        handleSelect(option.value);
                      },
                      children: /* @__PURE__ */ jsx15(X2, { className: "h-3 w-3 text-muted-foreground hover:text-foreground" })
                    }
                  )
                ]
              },
              option.value
            )) : /* @__PURE__ */ jsx15("span", { className: "text-muted-foreground", children: placeholder ?? "Select options..." }) }),
            /* @__PURE__ */ jsx15(ChevronsUpDown, { className: "h-4 w-4 shrink-0 opacity-50" })
          ]
        }
      ),
      open && !disabled && /* @__PURE__ */ jsxs9("div", { className: "absolute z-50 top-full mt-1 w-full rounded-md border bg-white text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95", children: [
        /* @__PURE__ */ jsx15("div", { className: "p-2", children: /* @__PURE__ */ jsx15(
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
        /* @__PURE__ */ jsx15("ul", { className: "max-h-80 overflow-auto p-1", children: filteredOptions.length > 0 ? filteredOptions.map((option) => /* @__PURE__ */ jsxs9(
          "li",
          {
            className: cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
            ),
            onClick: () => handleSelect(option.value),
            children: [
              /* @__PURE__ */ jsx15("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: selected.includes(option.value) && /* @__PURE__ */ jsx15(Check3, { className: "h-4 w-4" }) }),
              option.label
            ]
          },
          option.value
        )) : /* @__PURE__ */ jsx15("li", { className: "relative flex cursor-default select-none items-center justify-center py-1.5 px-2 text-sm text-muted-foreground", children: "No results found." }) })
      ] })
    ] })
  ] });
};

// src/components/OfferCard.native.tsx
import { View as View3, Text as Text2, TouchableOpacity as TouchableOpacity2, StyleSheet as StyleSheet3, ActivityIndicator as ActivityIndicator2 } from "react-native";
import { Colors as Colors3, Spacing as Spacing3, Typography as Typography2, Borders as Borders2, Shadows } from "@directdrive/theme";
import { jsx as jsx16, jsxs as jsxs10 } from "react/jsx-runtime";
var styles3 = StyleSheet3.create({
  card: {
    padding: Spacing3.lg,
    marginVertical: Spacing3.sm,
    borderRadius: Borders2.radius.lg,
    borderWidth: Borders2.width.DEFAULT,
    backgroundColor: Colors3.white,
    ...Shadows.subtle
  },
  pendingContainer: { backgroundColor: Colors3.warning.muted, borderColor: Colors3.warning.border },
  acceptedContainer: { backgroundColor: Colors3.success.muted, borderColor: Colors3.success.border },
  declinedContainer: { backgroundColor: Colors3.danger.muted, borderColor: Colors3.danger.border },
  counterOfferedContainer: { backgroundColor: Colors3.info.muted, borderColor: Colors3.info.border },
  cancelledContainer: { backgroundColor: Colors3.danger.muted, borderColor: Colors3.danger.border },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing3.xs
  },
  amount: {
    ...Typography2.heading.h6,
    color: Colors3.text.primary
  },
  statusBadge: {
    paddingHorizontal: Spacing3.md,
    paddingVertical: Spacing3.xs,
    borderRadius: Borders2.radius.full
  },
  pendingBadge: { backgroundColor: Colors3.warning.border },
  acceptedBadge: { backgroundColor: Colors3.success.border },
  declinedBadge: { backgroundColor: Colors3.danger.border },
  counterOfferedBadge: { backgroundColor: Colors3.info.border },
  cancelledBadge: { backgroundColor: Colors3.danger.border },
  statusText: {
    ...Typography2.body.sm,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase"
  },
  pendingText: { color: Colors3.warning.text },
  acceptedText: { color: Colors3.success.text },
  declinedText: { color: Colors3.danger.text },
  counterOfferedText: { color: Colors3.info.text },
  cancelledText: { color: Colors3.danger.text },
  dateText: {
    ...Typography2.body.sm,
    color: Colors3.text.secondary,
    marginBottom: Spacing3.md
  },
  buttonContainer: {
    marginTop: Spacing3.md,
    flexDirection: "row",
    gap: Spacing3.sm
  },
  button: {
    flex: 1,
    paddingVertical: Spacing3.md,
    borderRadius: Borders2.radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.button
  },
  acceptButton: { backgroundColor: Colors3.success.DEFAULT },
  declineButton: { backgroundColor: Colors3.danger.DEFAULT },
  counterButton: { backgroundColor: Colors3.info.DEFAULT },
  buttonText: {
    ...Typography2.button,
    color: Colors3.white
  }
});
var statusStyles = {
  PENDING: { container: styles3.pendingContainer, badge: styles3.pendingBadge, text: styles3.pendingText },
  ACCEPTED: { container: styles3.acceptedContainer, badge: styles3.acceptedBadge, text: styles3.acceptedText },
  DECLINED: { container: styles3.declinedContainer, badge: styles3.declinedBadge, text: styles3.declinedText },
  COUNTER_OFFERED: { container: styles3.counterOfferedContainer, badge: styles3.counterOfferedBadge, text: styles3.counterOfferedText },
  CANCELLED: { container: styles3.cancelledContainer, badge: styles3.cancelledBadge, text: styles3.cancelledText }
};

// src/components/OfferCard.web.tsx
import { jsx as jsx17, jsxs as jsxs11 } from "react/jsx-runtime";

// src/components/OfferModal.native.tsx
import { useState as useState4, useEffect as useEffect3 } from "react";
import { View as View5, Text as Text4, StyleSheet as StyleSheet5, Modal, Pressable as Pressable2, KeyboardAvoidingView, Platform } from "react-native";
import { Colors as Colors5, Spacing as Spacing5, Typography as Typography4 } from "@directdrive/theme";
import { X as X3 } from "lucide-react-native";

// src/components/StyledInput.tsx
import { View as View4, Text as Text3, TextInput, StyleSheet as StyleSheet4 } from "react-native";
import { Colors as Colors4, Spacing as Spacing4, Typography as Typography3, Borders as Borders3 } from "@directdrive/theme";
import { jsx as jsx18, jsxs as jsxs12 } from "react/jsx-runtime";
var styles4 = StyleSheet4.create({
  container: {
    marginBottom: Spacing4.md
  },
  label: {
    ...Typography3.body.md,
    color: Colors4.text.secondary,
    marginBottom: Spacing4.sm
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: Colors4.border.DEFAULT,
    borderRadius: Borders3.radius.md,
    paddingHorizontal: Spacing4.md,
    backgroundColor: Colors4.card,
    ...Typography3.body.md,
    color: Colors4.text.primary
  },
  inputError: {
    borderColor: Colors4.danger.DEFAULT
  },
  errorText: {
    ...Typography3.body.sm,
    color: Colors4.danger.DEFAULT,
    marginTop: Spacing4.xs
  }
});

// src/components/OfferModal.native.tsx
import { jsx as jsx19, jsxs as jsxs13 } from "react/jsx-runtime";
var styles5 = StyleSheet5.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  backdrop: {
    ...StyleSheet5.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing5.lg,
    paddingBottom: Spacing5.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: "absolute",
    top: Spacing5.md,
    right: Spacing5.md
  },
  modalTitle: {
    ...Typography4.heading.h3,
    marginBottom: Spacing5.sm,
    textAlign: "center"
  },
  modalDescription: {
    ...Typography4.body.md,
    color: Colors5.text.secondary,
    marginBottom: Spacing5.lg,
    textAlign: "center"
  }
});

// src/components/OfferModal.web.tsx
import { useState as useState5, useEffect as useEffect4 } from "react";
import { Loader2 } from "lucide-react";
import { jsx as jsx20, jsxs as jsxs14 } from "react/jsx-runtime";

// src/components/ScrollArea.tsx
import * as React14 from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { jsx as jsx21, jsxs as jsxs15 } from "react/jsx-runtime";
var ScrollArea = React14.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs15(
  ScrollAreaPrimitive.Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsx21(ScrollAreaPrimitive.Viewport, { className: "h-full w-full rounded-[inherit]", children }),
      /* @__PURE__ */ jsx21(ScrollBar, {}),
      /* @__PURE__ */ jsx21(ScrollAreaPrimitive.Corner, {})
    ]
  }
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React14.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx21(
  ScrollAreaPrimitive.Scrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx21(ScrollAreaPrimitive.Thumb, { className: "relative flex-1 rounded-full bg-border" })
  }
));
ScrollBar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;

// src/components/select.tsx
import * as React15 from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check as Check4, ChevronDown, ChevronUp } from "lucide-react";
import { jsx as jsx22, jsxs as jsxs16 } from "react/jsx-runtime";
var Select = SelectPrimitive.Root;
var SelectGroup = SelectPrimitive.Group;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React15.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs16(
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
      /* @__PURE__ */ jsx22(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx22(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React15.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx22(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx22(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React15.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx22(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn(
      "flex cursor-default items-center justify-center py-1",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx22(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React15.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx22(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs16(
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
      /* @__PURE__ */ jsx22(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx22(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx22(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React15.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx22(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React15.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs16(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx22("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx22(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx22(Check4, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx22(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React15.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx22(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// src/components/Skeleton.tsx
import { jsx as jsx23 } from "react/jsx-runtime";
function Skeleton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx23(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}

// src/components/sonner.tsx
import { Toaster as Sonner } from "sonner";
import { jsx as jsx24 } from "react/jsx-runtime";
var Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx24(
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

// src/components/Spinner.tsx
import { jsx as jsx25 } from "react/jsx-runtime";
var Spinner = ({ className, ...props }) => {
  return /* @__PURE__ */ jsx25(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: cn("animate-spin", className),
      ...props,
      children: /* @__PURE__ */ jsx25("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
    }
  );
};

// src/components/Switch.tsx
import * as React16 from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { jsx as jsx26 } from "react/jsx-runtime";
var Switch = React16.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx26(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx26(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          className
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;

// src/components/textarea.tsx
import * as React17 from "react";
import { jsx as jsx27 } from "react/jsx-runtime";
var Textarea = React17.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx27(
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

// src/components/tooltip.tsx
import * as React18 from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { jsx as jsx28 } from "react/jsx-runtime";
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React18.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx28(
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

// src/components/VehicleCard.native.tsx
import { View as View6, Text as Text5, StyleSheet as StyleSheet6, Image as Image3, Pressable as Pressable3, ActivityIndicator as ActivityIndicator3 } from "react-native";
import { useAuth, useSavedVehicles, useToggleSaveVehicle } from "@directdrive/hooks";
import { Colors as Colors6, Spacing as Spacing6, Typography as Typography5, Borders as Borders4 } from "@directdrive/theme";
import { Fuel, Gauge, GitMerge, MapPin, Heart } from "lucide-react-native";
import { jsx as jsx29, jsxs as jsxs17 } from "react/jsx-runtime";
var styles6 = StyleSheet6.create({
  card: {
    backgroundColor: Colors6.card,
    borderRadius: Borders4.radius.lg,
    overflow: "hidden",
    marginBottom: Spacing6.lg,
    borderWidth: 1,
    borderColor: Colors6.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  imageContainer: {
    position: "relative"
  },
  image: {
    width: "100%",
    height: 180
  },
  saveButton: {
    position: "absolute",
    top: Spacing6.md,
    right: Spacing6.md,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  contentContainer: {
    padding: Spacing6.md
  },
  title: {
    ...Typography5.heading.h6,
    color: Colors6.text.primary
  },
  variant: {
    ...Typography5.body.sm,
    color: Colors6.text.secondary,
    marginBottom: Spacing6.sm
  },
  price: {
    ...Typography5.heading.h5,
    color: Colors6.primary.DEFAULT,
    marginBottom: Spacing6.md
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: Spacing6.sm
  },
  infoText: {
    ...Typography5.body.sm,
    color: Colors6.text.secondary,
    marginLeft: Spacing6.sm
  }
});

// src/components/VehicleCard.web.tsx
import { Tag as Tag4, Fuel as Fuel2, Gauge as Gauge2, GitMerge as GitMerge2, MapPin as MapPin2, Heart as Heart2 } from "lucide-react";
import { useAuth as useAuth2 } from "@directdrive/hooks";
import { useFetchSavedVehicleListings, useToggleSaveVehicle as useToggleSaveVehicle2 } from "@directdrive/hooks";
import { formatPrice as formatPrice3, formatMileage as formatMileage3 } from "@directdrive/utils";
import { jsx as jsx30, jsxs as jsxs18 } from "react/jsx-runtime";
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
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Dropzone,
  Input,
  Label2 as Label,
  MultiSelect,
  ScrollArea,
  ScrollBar,
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
  Skeleton,
  Spinner,
  Switch,
  Textarea,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  badgeVariants,
  buttonVariants,
  cn
};
//# sourceMappingURL=index.mjs.map