import { Fragment, type ReactNode } from "react";

type Block =
  | { type: "h2" | "h3"; text: string }
  | { type: "paragraph" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function headingId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseBody(body: string) {
  const lines = body.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    paragraph = [];
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      index -= 1;
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\d+[.)]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [];
      while (index < lines.length && /^\d+[.)]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+[.)]\s+/, ""));
        index += 1;
      }
      index -= 1;
      blocks.push({ type: "ol", items });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
}

function renderBlock(block: Block, key: string): ReactNode {
  if (block.type === "h3") return <h3 key={key}>{block.text}</h3>;
  if (block.type === "paragraph") return <p key={key}>{block.text}</p>;
  if (block.type === "quote") return <blockquote key={key}>{block.text}</blockquote>;
  if (block.type === "ul") {
    return (
      <ul key={key}>
        {block.items.map((item, index) => <li key={`${key}-${index}`}>{item}</li>)}
      </ul>
    );
  }
  if (block.type === "ol") {
    return (
      <ol key={key}>
        {block.items.map((item, index) => <li key={`${key}-${index}`}>{item}</li>)}
      </ol>
    );
  }
  return null;
}

export default function ArticleBody({ body }: { body: string }) {
  const blocks = parseBody(body);
  const sections: Array<{ heading: string | null; blocks: Block[] }> = [];

  for (const block of blocks) {
    if (block.type === "h2") {
      sections.push({ heading: block.text, blocks: [] });
    } else {
      if (!sections.length) sections.push({ heading: null, blocks: [] });
      sections[sections.length - 1].blocks.push(block);
    }
  }

  return (
    <div className="article-content">
      {sections.map((section, sectionIndex) => {
        const sectionKey = section.heading || `intro-${sectionIndex}`;
        return (
          <section
            className="article-section"
            id={section.heading ? headingId(section.heading) : undefined}
            key={sectionKey}
          >
            {section.heading && <h2>{section.heading}</h2>}
            {section.blocks.map((block, blockIndex) => (
              <Fragment key={`${sectionKey}-${blockIndex}`}>
                {renderBlock(block, `${sectionKey}-${blockIndex}`)}
              </Fragment>
            ))}
          </section>
        );
      })}
    </div>
  );
}
