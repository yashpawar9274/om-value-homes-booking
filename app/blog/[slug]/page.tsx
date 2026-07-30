import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  fallbackManagedBlog,
} from "@/lib/content-store";
import { fetchManagedBlog } from "@/lib/public-content";
import { SITE_URL } from "@/lib/site-data";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

async function findPost(slug: string) {
  return fetchManagedBlog(slug).catch(() => fallbackManagedBlog(slug));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: ["/om-value-homes-building.png"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await findPost(slug);
  if (!post) notFound();

  const pageUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: pageUrl,
          image: post.coverImageUrl || `${SITE_URL}/om-value-homes-building.png`,
          author: { "@type": "Organization", name: "OM Value Homes" },
          publisher: {
            "@type": "Organization",
            name: "OM Value Homes",
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/om-value-homes-logo.jpeg`,
            },
          },
        }}
      />
      <SiteHeader />

      <article className="article-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/blog">Blog</Link><span>/</span>
          <strong>{post.category}</strong>
        </nav>
        <header>
          <p>{post.category} · OM Value Homes</p>
          <h1>{post.title}</h1>
          <span>{post.excerpt}</span>
          <div>
            Published {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })} · OM Value Homes
          </div>
        </header>

        <Image
          className="article-cover"
          src={post.coverImageUrl ?? "/om-value-homes-building.png"}
          alt={post.imageAlt}
          width={1254}
          height={1254}
          priority
          unoptimized={Boolean(post.coverImageUrl)}
        />

        {post.videoUrl && (
          <section className="article-video" aria-label={`${post.title} video`}>
            <div>
              <p>Watch the related video</p>
              <h2>See the project details visually.</h2>
            </div>
            <iframe
              src={post.videoUrl}
              title={`${post.title} — YouTube video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              loading="lazy"
            />
          </section>
        )}

        <div className="article-layout">
          <aside>
            <strong>In this guide</strong>
            {post.body
              .split("\n")
              .filter((line) => line.startsWith("## "))
              .map((line) => line.slice(3).trim())
              .map((heading) => (
              <a key={heading} href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                {heading}
              </a>
            ))}
          </aside>
          <div>
            <ArticleBody body={post.body} />
            <div className="article-disclaimer">
              <strong>Important:</strong> Property prices, availability, loan
              terms and possession details can change. Verify current information
              and documents before making a financial decision.
            </div>
          </div>
        </div>
      </article>

      <section className="final-cta">
        <div>
          <p>Ready to verify the project yourself?</p>
          <h2>Book a FREE guided site visit.</h2>
        </div>
        <Link className="button button-white" href="/#book">
          Book Visit <span aria-hidden="true">→</span>
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
