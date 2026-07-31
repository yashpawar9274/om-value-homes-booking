import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fallbackManagedBlogs } from "@/lib/content-store";
import { fetchManagedBlogs } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Palghar Real Estate & Homebuyer Blog",
  description:
    "Read practical guides about ready-possession flats, 1 BHK homes, site visits and home loans for property buyers in Palghar West.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const blogs = await fetchManagedBlogs().catch(fallbackManagedBlogs);

  return (
    <main>
      <SiteHeader />
      <section className="page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>/</span><strong>Blog</strong>
          </nav>
          <p>Palghar Property Knowledge</p>
          <h1>Clear guides for confident homebuyers.</h1>
          <span>
            Useful information about flat comparison, possession, site visits,
            documents and home-loan planning.
          </span>
        </div>
      </section>

      <section className="blog-index page-section">
        {blogs.map((post, index) => (
          <article className="blog-index-card" key={post.slug}>
            <div className="blog-index-number">0{index + 1}</div>
            <div>
              <span>{post.category}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <small>Published {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}</small>
              <Link href={`/blog/${post.slug}`}>
                Read full guide <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
