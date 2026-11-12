"use client";

import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { getIconComponent } from "@/lib/icons";

export function IconNodeView({ node }: NodeViewProps) {
  const name = String(node.attrs.name || "Lightbulb");
  const Icon = getIconComponent(name);

  return (
    <NodeViewWrapper className="xm-icon-block" data-type="icon" data-icon={name}>
      <span className="xm-icon-block__inner" contentEditable={false}>
        <Icon aria-hidden size={28} strokeWidth={1.75} />
        <span className="xm-icon-block__label">{name}</span>
      </span>
    </NodeViewWrapper>
  );
}
