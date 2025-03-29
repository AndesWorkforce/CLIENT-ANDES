"use client";

import { useMemo } from "react";
import YooptaEditor, {
  createYooptaEditor,
  YooEditor,
  YooptaContentValue,
} from "@yoopta/editor";
import Paragraph from "@yoopta/paragraph";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { NumberedList, BulletedList, TodoList } from "@yoopta/lists";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

const plugins = [
  Paragraph,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  NumberedList,
  BulletedList,
  TodoList,
];

interface OfferViewerProps {
  content: string | YooptaContentValue;
  className?: string;
}

export default function OfferViewer({
  content,
  className = "",
}: OfferViewerProps) {
  const editor: YooEditor = useMemo(() => createYooptaEditor(), []);

  // Convertir el contenido si viene como string
  const parsedContent = useMemo(() => {
    if (!content) {
      return undefined;
    }

    if (typeof content === "string") {
      try {
        return JSON.parse(content);
      } catch (error) {
        console.error("Error al parsear el contenido:", error);
        return undefined;
      }
    }
    return content;
  }, [content]);

  if (!parsedContent) {
    return <div className={className}>No hay contenido disponible</div>;
  }

  return (
    <div className={className}>
      <YooptaEditor
        editor={editor}
        plugins={plugins}
        value={parsedContent}
        readOnly={true}
        onChange={() => {}} // No se necesita onChange en modo solo lectura
        tools={{}} // Sin herramientas en modo solo lectura
        marks={MARKS}
      />
    </div>
  );
}
