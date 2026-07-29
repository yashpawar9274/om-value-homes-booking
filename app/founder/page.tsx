import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { fetchFounderContent } from "@/lib/public-content";
import { founderProjects as fallbackProjects } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founders & Project Journey | OM Group of Companies",
  description:
    "Meet the OM Group of Companies leadership team and explore previous, current and upcoming property projects.",
  alternates: { canonical: "/founder" },
};

export default async function FounderPage() {
  const managed = await fetchFounderContent().catch(() => ({
    founders: [],
    projects: [],
  }));

  const { founders, projects: managedProjects } = managed;

  const projects =
    managedProjects.length > 0
      ? managedProjects
      : fallbackProjects.map((project, index) => ({
          id: index + 1,
          stage: project.label,
          title: project.title,
          status: project.status,
          description: project.description,
          sortOrder: index + 1,
          updatedAt: "",
          imageUrl: project.image,
        }));

  return (
    <main>
      <SiteHeader />

      <section className="page-hero founder-page-hero">
        <div>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <strong>Founders</strong>
          </nav>

          <p>OM Group of Companies</p>

          <h1>A project journey built around practical homes.</h1>

          <span>
            Meet the team behind OM Value Homes and explore previous, latest
            and upcoming property work.
          </span>
        </div>
      </section>

      <section className="founders-list page-section">
        {founders.length > 0 ? (
          founders.map((founder, index) => (
            <div
              className={`founder-profile founder-profile-entry ${
                index % 2 !== 0 ? "founder-profile-reverse" : ""
              }`}
              key={founder.id}
            >
              <div className="founder-photo-card">
                <div className="founder-photo-placeholder">
                  <Image
                    src={founder.imageUrl ?? "/om-value-homes-logo.jpeg"}
                    alt={`${founder.name} — ${founder.role}`}
                    width={831}
                    height={831}
                    unoptimized={Boolean(founder.imageUrl)}
                  />

                  {!founder.imageUrl && (
                    <span>Founder photo can be added from admin</span>
                  )}
                </div>
              </div>

              <article>
                <p className="section-kicker">{founder.role}</p>

                <h2>{founder.headline}</h2>

                <p>{founder.bio}</p>

                <strong className="founder-name">{founder.name}</strong>
              </article>
            </div>
          ))
        ) : (
          <div className="founder-empty">
            <h2>Leadership information coming soon.</h2>
            <p>Founder profiles can be added from the admin panel.</p>
          </div>
        )}
      </section>

      <section className="project-journey page-section">
        <div className="section-heading dark">
          <div>
            <p className="section-kicker">Project timeline</p>
            <h2>Previous, latest and upcoming properties.</h2>
          </div>

          <p>
            Explore completed, current and upcoming property developments by
            OM Group of Companies.
          </p>
        </div>

        <div className="journey-grid">
          {projects.map((project, index) => (
            <article key={project.id}>
              <div className="journey-image">
                <Image
                  src={project.imageUrl ?? "/om-value-homes-building.png"}
                  alt={`${project.title} project`}
                  width={1254}
                  height={1254}
                  unoptimized={Boolean(project.imageUrl)}
                />

                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <p>{project.stage} Project</p>
              <h3>{project.title}</h3>
              <strong>{project.status}</strong>
              <span>{project.description}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <p>Explore the current flagship project.</p>
          <h2>See Fair Township in Palghar West.</h2>
        </div>

        <Link className="button button-white" href="/homes">
          View Homes <span aria-hidden="true">→</span>
        </Link>
      </section>

      <SiteFooter />
    </main>
  );
}
