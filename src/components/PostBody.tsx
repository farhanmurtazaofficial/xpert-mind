"use client";

import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { getIconComponent } from "@/lib/icons";

type Props = {
  html: string;
};

export function PostBody({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const roots: Root[] = [];
    const nodes = host.querySelectorAll<HTMLElement>('[data-type="icon"]');

    nodes.forEach((node) => {
      const name = node.getAttribute("data-icon") || "Lightbulb";
      const Icon = getIconComponent(name);
      node.innerHTML = "";
      node.classList.add("xm-icon-block");
      const mount = document.createElement("span");
      mount.className = "xm-icon-block__inner";
      node.appendChild(mount);
      const root = createRoot(mount);
      root.render(
        <>
          <Icon aria-hidden size={28} strokeWidth={1.75} />
          <span className="sr-only">{name}</span>
        </>
      );
      roots.push(root);
    });

    return () => {
      roots.forEach((root) => root.unmount());
    };
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
