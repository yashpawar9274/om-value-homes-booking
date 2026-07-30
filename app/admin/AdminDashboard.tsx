"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type {
  ManagedAmenity,
  ManagedBlog,
  ManagedCustomerStory,
  ManagedFaq,
  ManagedFounder,
  ManagedFounderProject,
  ManagedHome,
  ManagedSiteSettings,
} from "@/lib/content-store";
import { createClient } from "@/lib/supabase/client";
import AdminFlatTourForm from "./AdminFlatTourForm";

type ContentState = {
  blogs: ManagedBlog[];
  founders: ManagedFounder[];
  projects: ManagedFounderProject[];
  customers: ManagedCustomerStory[];
  homes: ManagedHome[];
  amenities: ManagedAmenity[];
  faqs: ManagedFaq[];
  siteSettings: ManagedSiteSettings | null;
};

type Tab =
  | "site"
  | "homes"
  | "videos"
  | "blogs"
  | "amenities"
  | "customers"
  | "founders";

type DeleteKind =
  | "blog"
  | "founder"
  | "project"
  | "customer"
  | "home"
  | "amenity"
  | "faq";

const emptyContent: ContentState = {
  blogs: [],
  founders: [],
  projects: [],
  customers: [],
  homes: [],
  amenities: [],
  faqs: [],
  siteSettings: null,
};

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function addImageUpload(form: FormData, kind: string) {
  const file = form.get("image");
  form.delete("image");
  if (!(file instanceof File) || file.size === 0) return;
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Use a JPG, PNG, WebP or GIF image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be smaller than 10 MB.");
  }
  const extension =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type.split("/")[1].replace(/[^a-z0-9]/gi, "").toLowerCase();
  const path = `content/${kind}/${crypto.randomUUID()}.${extension}`;
  const { error } = await createClient()
    .storage.from("content-media")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });
  if (error) throw error;
  form.set("imagePath", path);
}

function ImageControl({
  currentUrl,
  label,
}: {
  currentUrl?: string | null;
  label: string;
}) {
  return (
    <fieldset className="admin-image-control">
      <legend>{label}</legend>
      {currentUrl && (
        <Image
          src={currentUrl}
          alt="Current uploaded media"
          width={320}
          height={180}
          unoptimized
        />
      )}
      <label>
        <span>{currentUrl ? "Replace image" : "Upload image"}</span>
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
      </label>
      {currentUrl && (
        <label className="admin-check">
          <input name="removeImage" type="checkbox" />
          <span>Remove current image</span>
        </label>
      )}
    </fieldset>
  );
}

function Actions({
  editing,
  busy,
  onCancel,
}: {
  editing: boolean;
  busy: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="admin-editor-actions">
      <button type="submit" disabled={busy}>
        {busy ? "Saving…" : editing ? "Update" : "Publish"}
      </button>
      {editing && (
        <button className="admin-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("site");
  const [content, setContent] = useState<ContentState>(emptyContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [blogDraft, setBlogDraft] = useState<ManagedBlog | null>(null);
  const [homeDraft, setHomeDraft] = useState<ManagedHome | null>(null);
  const [amenityDraft, setAmenityDraft] = useState<ManagedAmenity | null>(null);
  const [faqDraft, setFaqDraft] = useState<ManagedFaq | null>(null);
  const [customerDraft, setCustomerDraft] = useState<ManagedCustomerStory | null>(null);
  const [founderDraft, setFounderDraft] = useState<ManagedFounder | null>(null);
  const [projectDraft, setProjectDraft] = useState<ManagedFounderProject | null>(null);

  useEffect(() => {
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as ContentState & {
          authorized?: boolean;
          error?: string;
        };
        if (!response.ok) throw new Error(data.error || "Admin access required.");
        setIsAuthorized(data.authorized ?? true);
        setContent(data);
      })
      .catch((error) => {
        setIsAuthorized(false);
        setMessage(error instanceof Error ? error.message : "Admin access failed.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  function clearDrafts() {
    setBlogDraft(null);
    setHomeDraft(null);
    setAmenityDraft(null);
    setFaqDraft(null);
    setCustomerDraft(null);
    setFounderDraft(null);
    setProjectDraft(null);
  }

  async function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const kind = String(form.get("kind") || "");
    setIsSaving(true);
    setMessage("Uploading and saving changes…");
    try {
      if (["blog", "founder", "project", "customer", "home"].includes(kind)) {
        await addImageUpload(form, kind);
      }
      const response = await fetch("/api/admin/content", { method: "POST", body: form });
      const data = (await response.json()) as ContentState & { error?: string };
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setContent(data);
      clearDrafts();
      setMessage("Changes are live on the website.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeRecord(kind: DeleteKind, id: number, label: string) {
    if (!window.confirm(`Delete “${label}” from the website?`)) return;
    setIsSaving(true);
    setMessage("Deleting content…");
    try {
      const response = await fetch(
        `/api/admin/content?kind=${encodeURIComponent(kind)}&id=${id}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as ContentState & { error?: string };
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setContent(data);
      clearDrafts();
      setMessage("Content deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="admin-card admin-loading">
        <span />
        <strong>Loading complete website manager…</strong>
      </section>
    );
  }
  if (!isAuthorized) {
    return (
      <section className="admin-denied admin-card">
        <h2>Admin access required</h2>
        <p>{message || "This account cannot edit website content."}</p>
      </section>
    );
  }

  const settings = content.siteSettings;
  const siteFields: Array<{
    name: keyof ManagedSiteSettings;
    label: string;
    multiline?: boolean;
  }> = [
    { name: "heroEyebrow", label: "Hero small line" },
    { name: "heroTitle", label: "Hero main heading" },
    { name: "heroLead", label: "Hero description", multiline: true },
    { name: "priceLabel", label: "Price label" },
    { name: "priceValue", label: "Price value" },
    { name: "projectKicker", label: "Project small heading" },
    { name: "projectTitle", label: "Project main heading" },
    { name: "projectDescription", label: "Project description", multiline: true },
    { name: "homesTitle", label: "Homes section heading" },
    { name: "homesDescription", label: "Homes section description", multiline: true },
    { name: "amenitiesTitle", label: "Amenities heading" },
    { name: "amenitiesDescription", label: "Amenities description", multiline: true },
    { name: "blogsTitle", label: "Blog section heading" },
    { name: "blogsDescription", label: "Blog section description", multiline: true },
    { name: "locationTitle", label: "Location heading" },
    { name: "locationDescription", label: "Location description", multiline: true },
    { name: "address", label: "Full address", multiline: true },
    { name: "mapEmbedUrl", label: "Google Maps embed URL", multiline: true },
    { name: "googleMapsLink", label: "Google Maps open link" },
    { name: "whatsappNumber", label: "WhatsApp number with country code" },
    { name: "whatsappDisplay", label: "WhatsApp display number" },
    { name: "callNumber", label: "Call number with country code" },
    { name: "callDisplay", label: "Call display number" },
    { name: "reraNumber", label: "MahaRERA number" },
  ];

  return (
    <>
      <nav className="admin-tabs admin-tabs-wide" aria-label="Admin content sections">
        {[
          ["site", "Website"],
          ["homes", "1/2/3 BHK"],
          ["videos", "Videos"],
          ["blogs", "Blogs"],
          ["amenities", "Amenities & FAQs"],
          ["customers", "Customers"],
          ["founders", "Founders & Projects"],
        ].map(([value, label]) => (
          <button
            className={activeTab === value ? "active" : ""}
            key={value}
            type="button"
            onClick={() => setActiveTab(value as Tab)}
          >
            {label}
          </button>
        ))}
      </nav>

      {message && <p className="admin-global-message" aria-live="polite">{message}</p>}

      {activeTab === "site" && settings && (
        <form
          className="admin-card admin-form admin-site-form"
          key={settings.updatedAt || "site-settings"}
          onSubmit={submitContent}
        >
          <div className="admin-card-heading">
            <span>01</span>
            <div><p>Full Website Control</p><h2>Edit homepage, contact and location text</h2></div>
          </div>
          <input name="kind" type="hidden" value="site" />
          <div className="admin-site-fields">
            {siteFields.map((field) => (
              <label className={field.multiline ? "wide" : ""} key={field.name}>
                <span>{field.label}</span>
                {field.multiline ? (
                  <textarea
                    name={field.name}
                    rows={field.name === "mapEmbedUrl" ? 4 : 3}
                    defaultValue={String(settings[field.name] ?? "")}
                    required
                  />
                ) : (
                  <input name={field.name} defaultValue={String(settings[field.name] ?? "")} required />
                )}
              </label>
            ))}
          </div>
          <button type="submit" disabled={isSaving}>Save Website Settings</button>
        </form>
      )}

      {activeTab === "homes" && (
        <div className="admin-manager-grid">
          <form
            className="admin-card admin-form admin-editor"
            key={homeDraft?.id ?? "new-home"}
            onSubmit={submitContent}
          >
            <div className="admin-card-heading">
              <span>01</span>
              <div><p>Home Manager</p><h2>{homeDraft ? "Edit home configuration" : "Add home configuration"}</h2></div>
            </div>
            <input name="kind" type="hidden" value="home" />
            {homeDraft && <input name="id" type="hidden" value={homeDraft.id} />}
            <div className="admin-field-row">
              <label><span>BHK label</span><input name="bhk" defaultValue={homeDraft?.bhk} placeholder="1 BHK" required /></label>
              <label><span>Display number</span><input name="number" defaultValue={homeDraft?.number ?? String(content.homes.length + 1).padStart(2, "0")} required /></label>
            </div>
            <label><span>URL slug</span><input name="slug" defaultValue={homeDraft?.slug} placeholder="1-bhk-flat-palghar-west" required /></label>
            <div className="admin-field-row">
              <label><span>Price</span><input name="price" defaultValue={homeDraft?.price} required /></label>
              <label><span>Carpet area</span><input name="area" defaultValue={homeDraft?.area} required /></label>
            </div>
            <label><span>Status</span><input name="status" defaultValue={homeDraft?.status} required /></label>
            <label><span>Headline</span><textarea name="headline" rows={3} defaultValue={homeDraft?.headline} required /></label>
            <label><span>Overview</span><textarea name="overview" rows={6} defaultValue={homeDraft?.overview} required /></label>
            <label><span>Suitable for</span><textarea name="idealFor" rows={3} defaultValue={homeDraft?.idealFor} required /></label>
            <label>
              <span>Highlights — one item per line</span>
              <textarea name="highlights" rows={7} defaultValue={homeDraft?.highlights.join("\n")} required />
            </label>
            <label><span>SEO title</span><input name="metaTitle" defaultValue={homeDraft?.metaTitle} /></label>
            <label><span>SEO description</span><textarea name="metaDescription" rows={3} defaultValue={homeDraft?.metaDescription} /></label>
            <div className="admin-field-row">
              <label><span>Display order</span><input name="sortOrder" type="number" min={1} defaultValue={homeDraft?.sortOrder ?? content.homes.length + 1} /></label>
              <label className="admin-check"><input name="isVisible" type="checkbox" defaultChecked={homeDraft?.isVisible ?? true} /><span>Visible on website</span></label>
            </div>
            <ImageControl currentUrl={homeDraft?.imageUrl} label="Home card and detail image" />
            <Actions editing={Boolean(homeDraft)} busy={isSaving} onCancel={() => setHomeDraft(null)} />
          </form>
          <section className="admin-card admin-record-list">
            <div className="admin-card-heading"><span>02</span><div><p>Home Cards</p><h2>{content.homes.length} configurations</h2></div></div>
            {content.homes.map((home) => (
              <article key={home.id}>
                {home.imageUrl ? <Image src={home.imageUrl} alt="" width={160} height={100} unoptimized /> : <div className="admin-list-placeholder">Home</div>}
                <div><small>{home.isVisible ? "Visible" : "Hidden"} · order {home.sortOrder}</small><strong>{home.bhk} · {home.price}</strong><span>{home.slug}</span></div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => setHomeDraft(home)}>Edit</button>
                  <button className="danger" type="button" onClick={() => removeRecord("home", home.id, home.bhk)}>Delete</button>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}

      {activeTab === "videos" && <AdminFlatTourForm />}

      {activeTab === "blogs" && (
        <div className="admin-manager-grid">
          <form className="admin-card admin-form admin-editor" key={blogDraft?.id ?? "new-blog"} onSubmit={submitContent}>
            <div className="admin-card-heading"><span>01</span><div><p>Blog Manager</p><h2>{blogDraft ? "Edit blog post" : "Create readable blog"}</h2></div></div>
            <input name="kind" type="hidden" value="blog" />
            {blogDraft && <input name="id" type="hidden" value={blogDraft.id} />}
            <label><span>Blog title</span><input name="title" defaultValue={blogDraft?.title} required /></label>
            <div className="admin-field-row">
              <label><span>URL slug</span><input name="slug" defaultValue={blogDraft?.slug} placeholder="palghar-home-guide" required /></label>
              <label><span>Category</span><input name="category" defaultValue={blogDraft?.category ?? "Homebuyer Guide"} required /></label>
            </div>
            <label><span>Short excerpt</span><textarea name="excerpt" rows={3} defaultValue={blogDraft?.excerpt} required /></label>
            <label>
              <span>Article content</span>
              <textarea
                className="admin-article-editor"
                name="body"
                rows={20}
                defaultValue={blogDraft?.body}
                placeholder={"## Main section\n\nWrite each paragraph on a new block.\n\n### Small heading\n\n- First point\n- Second point"}
                required
              />
              <small>Use ## for section headings, ### for small headings, blank lines for paragraphs, and - for bullet points.</small>
            </label>
            <label>
              <span>YouTube video link or iframe embed code</span>
              <textarea name="youtubeInput" rows={4} defaultValue={blogDraft?.videoUrl ?? ""} placeholder="Optional: paste YouTube link or embed code" />
              <small>Only YouTube is accepted. Embed HTML is converted to a safe privacy-enhanced URL.</small>
            </label>
            <div className="admin-field-row">
              <label><span>SEO title</span><input name="seoTitle" defaultValue={blogDraft?.seoTitle} /></label>
              <label><span>Publish date</span><input name="publishedAt" type="date" defaultValue={blogDraft?.publishedAt ?? today()} required /></label>
            </div>
            <label><span>SEO description</span><textarea name="seoDescription" rows={3} defaultValue={blogDraft?.seoDescription} /></label>
            <label><span>Image alt text</span><input name="imageAlt" defaultValue={blogDraft?.imageAlt} placeholder="Describe the actual blog cover image" /></label>
            <ImageControl currentUrl={blogDraft?.coverImageUrl} label="Blog cover image" />
            <Actions editing={Boolean(blogDraft)} busy={isSaving} onCancel={() => setBlogDraft(null)} />
          </form>
          <section className="admin-card admin-record-list">
            <div className="admin-card-heading"><span>02</span><div><p>Published Content</p><h2>{content.blogs.length} blog posts</h2></div></div>
            {content.blogs.map((blog) => (
              <article key={blog.id}>
                {blog.coverImageUrl ? <Image src={blog.coverImageUrl} alt="" width={160} height={100} unoptimized /> : <div className="admin-list-placeholder">Blog</div>}
                <div><small>{blog.category} · {blog.videoUrl ? "Video added" : "No video"}</small><strong>{blog.title}</strong><span>/blog/{blog.slug}</span></div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => setBlogDraft(blog)}>Edit</button>
                  <button className="danger" type="button" onClick={() => removeRecord("blog", blog.id, blog.title)}>Delete</button>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}

      {activeTab === "amenities" && (
        <div className="admin-two-manager-stack">
          <div className="admin-manager-grid">
            <form className="admin-card admin-form admin-editor" key={amenityDraft?.id ?? "new-amenity"} onSubmit={submitContent}>
              <div className="admin-card-heading"><span>01</span><div><p>Amenity Manager</p><h2>{amenityDraft ? "Edit amenity" : "Add amenity"}</h2></div></div>
              <input name="kind" type="hidden" value="amenity" />
              {amenityDraft && <input name="id" type="hidden" value={amenityDraft.id} />}
              <label><span>Title</span><input name="title" defaultValue={amenityDraft?.title} required /></label>
              <label><span>Description</span><textarea name="description" rows={4} defaultValue={amenityDraft?.description} required /></label>
              <div className="admin-field-row">
                <label><span>Display order</span><input name="sortOrder" type="number" min={1} defaultValue={amenityDraft?.sortOrder ?? content.amenities.length + 1} /></label>
                <label className="admin-check"><input name="isVisible" type="checkbox" defaultChecked={amenityDraft?.isVisible ?? true} /><span>Visible</span></label>
              </div>
              <Actions editing={Boolean(amenityDraft)} busy={isSaving} onCancel={() => setAmenityDraft(null)} />
            </form>
            <section className="admin-card admin-record-list">
              <div className="admin-card-heading"><span>02</span><div><p>Amenities</p><h2>{content.amenities.length} items</h2></div></div>
              {content.amenities.map((item) => (
                <article className="admin-text-record" key={item.id}>
                  <div className="admin-list-placeholder">{String(item.sortOrder).padStart(2, "0")}</div>
                  <div><small>{item.isVisible ? "Visible" : "Hidden"}</small><strong>{item.title}</strong><span>{item.description}</span></div>
                  <div className="admin-row-actions"><button type="button" onClick={() => setAmenityDraft(item)}>Edit</button><button className="danger" type="button" onClick={() => removeRecord("amenity", item.id, item.title)}>Delete</button></div>
                </article>
              ))}
            </section>
          </div>
          <div className="admin-manager-grid">
            <form className="admin-card admin-form admin-editor" key={faqDraft?.id ?? "new-faq"} onSubmit={submitContent}>
              <div className="admin-card-heading"><span>03</span><div><p>FAQ Manager</p><h2>{faqDraft ? "Edit question" : "Add question"}</h2></div></div>
              <input name="kind" type="hidden" value="faq" />
              {faqDraft && <input name="id" type="hidden" value={faqDraft.id} />}
              <label><span>Question</span><input name="question" defaultValue={faqDraft?.question} required /></label>
              <label><span>Answer</span><textarea name="answer" rows={5} defaultValue={faqDraft?.answer} required /></label>
              <div className="admin-field-row">
                <label><span>Display order</span><input name="sortOrder" type="number" min={1} defaultValue={faqDraft?.sortOrder ?? content.faqs.length + 1} /></label>
                <label className="admin-check"><input name="isVisible" type="checkbox" defaultChecked={faqDraft?.isVisible ?? true} /><span>Visible</span></label>
              </div>
              <Actions editing={Boolean(faqDraft)} busy={isSaving} onCancel={() => setFaqDraft(null)} />
            </form>
            <section className="admin-card admin-record-list">
              <div className="admin-card-heading"><span>04</span><div><p>FAQs</p><h2>{content.faqs.length} questions</h2></div></div>
              {content.faqs.map((item) => (
                <article className="admin-text-record" key={item.id}>
                  <div className="admin-list-placeholder">FAQ</div>
                  <div><small>{item.isVisible ? "Visible" : "Hidden"}</small><strong>{item.question}</strong><span>{item.answer}</span></div>
                  <div className="admin-row-actions"><button type="button" onClick={() => setFaqDraft(item)}>Edit</button><button className="danger" type="button" onClick={() => removeRecord("faq", item.id, item.question)}>Delete</button></div>
                </article>
              ))}
            </section>
          </div>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="admin-manager-grid">
          <form className="admin-card admin-form admin-editor" key={customerDraft?.id ?? "new-customer"} onSubmit={submitContent}>
            <div className="admin-card-heading"><span>01</span><div><p>Happy Customer Manager</p><h2>{customerDraft ? "Edit customer card" : "Add approved story"}</h2></div></div>
            <input name="kind" type="hidden" value="customer" />
            {customerDraft && <input name="id" type="hidden" value={customerDraft.id} />}
            <label><span>Customer name</span><input name="name" defaultValue={customerDraft?.name} required /></label>
            <label><span>Card title</span><input name="title" defaultValue={customerDraft?.title} required /></label>
            <label><span>Customer story</span><textarea name="story" rows={6} defaultValue={customerDraft?.story} required /></label>
            <div className="admin-field-row">
              <label><span>Photo layout</span><select name="orientation" defaultValue={customerDraft?.orientation ?? "landscape"}><option value="landscape">Landscape</option><option value="portrait">Portrait</option></select></label>
              <label><span>Display order</span><input name="sortOrder" type="number" min={1} defaultValue={customerDraft?.sortOrder ?? content.customers.length + 1} /></label>
            </div>
            <ImageControl currentUrl={customerDraft?.imageUrl} label="Approved customer photo" />
            <Actions editing={Boolean(customerDraft)} busy={isSaving} onCancel={() => setCustomerDraft(null)} />
          </form>
          <section className="admin-card admin-record-list">
            <div className="admin-card-heading"><span>02</span><div><p>Customer Cards</p><h2>{content.customers.length} stories</h2></div></div>
            {content.customers.map((item) => (
              <article key={item.id}>
                {item.imageUrl ? <Image src={item.imageUrl} alt="" width={160} height={100} unoptimized /> : <div className="admin-list-placeholder">Photo</div>}
                <div><small>{item.orientation} · order {item.sortOrder}</small><strong>{item.name}</strong><span>{item.title}</span></div>
                <div className="admin-row-actions"><button type="button" onClick={() => setCustomerDraft(item)}>Edit</button><button className="danger" type="button" onClick={() => removeRecord("customer", item.id, item.name)}>Delete</button></div>
              </article>
            ))}
          </section>
        </div>
      )}

      {activeTab === "founders" && (
        <div className="admin-two-manager-stack">
          <div className="admin-manager-grid">
            <form className="admin-card admin-form admin-editor" key={founderDraft?.id ?? "new-founder"} onSubmit={submitContent}>
              <div className="admin-card-heading"><span>01</span><div><p>Multiple Founders</p><h2>{founderDraft ? "Edit founder" : "Add founder"}</h2></div></div>
              <input name="kind" type="hidden" value="founder" />
              {founderDraft && <input name="id" type="hidden" value={founderDraft.id} />}
              <div className="admin-field-row"><label><span>Name</span><input name="name" defaultValue={founderDraft?.name} required /></label><label><span>Role</span><input name="role" defaultValue={founderDraft?.role} required /></label></div>
              <label><span>Main headline</span><input name="headline" defaultValue={founderDraft?.headline} required /></label>
              <label><span>Biography</span><textarea name="bio" rows={7} defaultValue={founderDraft?.bio} required /></label>
              <label><span>Display order</span><input name="sortOrder" type="number" min={1} defaultValue={founderDraft?.sortOrder ?? content.founders.length + 1} /></label>
              <ImageControl currentUrl={founderDraft?.imageUrl} label="Founder portrait" />
              <Actions editing={Boolean(founderDraft)} busy={isSaving} onCancel={() => setFounderDraft(null)} />
            </form>
            <section className="admin-card admin-record-list">
              <div className="admin-card-heading"><span>02</span><div><p>Leadership Profiles</p><h2>{content.founders.length} founders</h2></div></div>
              {content.founders.map((item) => (
                <article key={item.id}>
                  {item.imageUrl ? <Image src={item.imageUrl} alt="" width={160} height={100} unoptimized /> : <div className="admin-list-placeholder">Founder</div>}
                  <div><small>Order {item.sortOrder}</small><strong>{item.name}</strong><span>{item.role}</span></div>
                  <div className="admin-row-actions"><button type="button" onClick={() => setFounderDraft(item)}>Edit</button><button className="danger" type="button" onClick={() => removeRecord("founder", item.id, item.name)}>Delete</button></div>
                </article>
              ))}
            </section>
          </div>
          <div className="admin-manager-grid">
            <form className="admin-card admin-form admin-editor" key={projectDraft?.id ?? "new-project"} onSubmit={submitContent}>
              <div className="admin-card-heading"><span>03</span><div><p>Project Journey</p><h2>{projectDraft ? "Edit project" : "Add project"}</h2></div></div>
              <input name="kind" type="hidden" value="project" />
              {projectDraft && <input name="id" type="hidden" value={projectDraft.id} />}
              <div className="admin-field-row"><label><span>Stage</span><select name="stage" defaultValue={projectDraft?.stage ?? "Latest"}><option>Previous</option><option>Latest</option><option>Upcoming</option></select></label><label><span>Order</span><input name="sortOrder" type="number" min={1} defaultValue={projectDraft?.sortOrder ?? content.projects.length + 1} /></label></div>
              <label><span>Project title</span><input name="title" defaultValue={projectDraft?.title} required /></label>
              <label><span>Status</span><input name="status" defaultValue={projectDraft?.status} required /></label>
              <label><span>Description</span><textarea name="description" rows={6} defaultValue={projectDraft?.description} required /></label>
              <ImageControl currentUrl={projectDraft?.imageUrl} label="Project image" />
              <Actions editing={Boolean(projectDraft)} busy={isSaving} onCancel={() => setProjectDraft(null)} />
            </form>
            <section className="admin-card admin-record-list">
              <div className="admin-card-heading"><span>04</span><div><p>Project Cards</p><h2>{content.projects.length} projects</h2></div></div>
              {content.projects.map((item) => (
                <article key={item.id}>
                  {item.imageUrl ? <Image src={item.imageUrl} alt="" width={160} height={100} unoptimized /> : <div className="admin-list-placeholder">Project</div>}
                  <div><small>{item.stage} · order {item.sortOrder}</small><strong>{item.title}</strong><span>{item.status}</span></div>
                  <div className="admin-row-actions"><button type="button" onClick={() => setProjectDraft(item)}>Edit</button><button className="danger" type="button" onClick={() => removeRecord("project", item.id, item.title)}>Delete</button></div>
                </article>
              ))}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
