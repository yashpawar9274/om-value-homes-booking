export default function ArticleBody({ body }: { body: string }) {
  const blocks = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="article-content">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          const heading = block.slice(3).trim();
          const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return <h2 id={id} key={`${heading}-${index}`}>{heading}</h2>;
        }

        const lines = block.split("\n").map((line) => line.trim());
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={`list-${index}`}>
              {lines.map((line) => <li key={line}>{line.slice(2)}</li>)}
            </ul>
          );
        }

        return <p key={`paragraph-${index}`}>{block}</p>;
      })}
    </div>
  );
}
