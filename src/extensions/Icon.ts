import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { IconNodeView } from "@/components/editor/IconNodeView";

export type IconOptions = {
  HTMLAttributes: Record<string, unknown>;
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    icon: {
      insertIcon: (name: string) => ReturnType;
    };
  }
}

export const Icon = Node.create<IconOptions>({
  name: "icon",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      name: {
        default: "Lightbulb",
        parseHTML: (element) => element.getAttribute("data-icon"),
        renderHTML: (attributes) => ({
          "data-icon": attributes.name,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="icon"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "icon",
        class: "xm-icon-block",
      }),
    ];
  },

  addCommands() {
    return {
      insertIcon:
        (name: string) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { name },
          }),
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(IconNodeView);
  },
});
