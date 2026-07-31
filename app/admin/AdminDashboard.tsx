"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type {
  ManagedBlog,
  ManagedCustomerStory,
  ManagedFounder,
  ManagedFounderProject,
} from "@/lib/content-store";
import { createClient } from "@/lib/supabase/client";
import { adminFetch } from "@/lib/admin-fetch";
import AdminFlatTourForm from "./AdminFlatTourForm";

type ContentState = {
  blogs: ManagedBlog[];
  founder: ManagedFounder | null;
  projects: ManagedFounderProject[];
  customers: ManagedCustomerStory[];
};

type Tab = "blogs" | "flat-tour" | "customers" | "founder";

const emptyContent: ContentState = {
  blogs: [],
  founder: null,
  projects: [],
  customers: [],
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function addImageUpload(form: FormData, kind: string) {
  const file = form.get("image");
  form.delete("image");
  if (!(file instanceof File) || file.size === 0) return;
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image must be smaller than 10 MB.");
  }

  const extension =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-z0-9]/gi, "")
      .toLowerCase() || "jpg";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("blogs");
  const [content, setContent] = useState<ContentState>(emptyContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [blogDraft, setBlogDraft] = useState<ManagedBlog | null>(null);
  const [customerDraft, setCustomerDraft] =
    useState<ManagedCustomerStory | null>(null);
  const [projectDraft, setProjectDraft] =
    useState<ManagedFounderProject | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/content")
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

  async function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setIsSaving(true);
    setMessage("Uploading and saving changes…");
    try {
      await addImageUpload(form, String(form.get("kind") || ""));
      const response = await adminFetch("/api/admin/content", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as ContentState & { error?: string };
      if (!response.ok) throw new Error(data.error || "Save failed.");
      setContent(data);
      setBlogDraft(null);
      setCustomerDraft(null);
      setProjectDraft(null);
      setMessage("Changes are live on the website.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeRecord(
    kind: "blog" | "customer" | "project",
    id: number,
    label: string,
  ) {
    if (!window.confirm(`Delete “${label}” from the website?`)) return;
    setIsSaving(true);
    setMessage("Deleting content…");
    try {
      const response = await adminFetch(
        `/api/admin/content?kind=${kind}&id=${id}`,
        { method: "DELETE" },
      );
      const data = (await response.json()) as ContentState & { error?: string };
      if (!response.ok) throw new Error(data.error || "Delete failed.");
      setContent(data);
      setBlogDraft(null);
      setCustomerDraft(null);
      setProjectDraft(null);
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
        <strong>Loading content manager…</strong>
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

  return (
    <>
      <nav className="admin-tabs" aria-label="Admin content sections">
        {[
          ["blogs", "Blog CRUD"],
          ["flat-tour", "Flat Tour"],
          ["customers", "Happy Customers"],
          ["founder", "Founder & Projects"],
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

      {message && (
        <p className="admin-global-message" aria-live="polite">
          {message}
        </p>
      )}

      {activeTab === "flat-tour" && <AdminFlatTourForm />}

      {activeTab === "blogs" && (
        <div className="admin-manager-grid">
          <form
            className="admin-card admin-form admin-editor"
            key={blogDraft?.id ?? "new-blog"}
            onSubmit={submitContent}
          >
            <div className="admin-card-heading">
              <span>01</span>
              <div>
                <p>Blog Manager</p>
                <h2>{blogDraft ? "Edit blog post" : "Create blog post"}</h2>
              </div>
            </div>
            <input name="kind" type="hidden" value="blog" />
            {blogDraft && <input name="id" type="hidden" value={blogDraft.id} />}
            <label>
              <span>Blog title</span>
              <input name="title" defaultValue={blogDraft?.title} required />
            </label>
            <div className="admin-field-row">
              <label>
                <span>URL slug</span>
                <input
                  name="slug"
                  defaultValue={blogDraft?.slug}
                  placeholder="1-bhk-flat-palghar-west-guide"
                  required
                />
              </label>
              <label>
                <span>Category</span>
                <input
                  name="category"
                  defaultValue={blogDraft?.category ?? "Homebuyer Guide"}
                  required
                />
              </label>
            </div>
            <label>
              <span>Short excerpt</span>
              <textarea
                name="excerpt"
                rows={3}
                defaultValue={blogDraft?.excerpt}
                required
              />
            </label>
            <label>
              <span>Article content</span>
              <textarea
                name="body"
                rows={13}
                defaultValue={blogDraft?.body}
                placeholder={"Use ## before headings and - for bullet points.\n\nWrite useful, original content for buyers."}
                required
              />
            </label>
            <div className="admin-field-row">
              <label>
                <span>SEO title</span>
                <input name="seoTitle" defaultValue={blogDraft?.seoTitle} />
              </label>
              <label>
                <span>Publish date</span>
                <input
                  name="publishedAt"
                  type="date"
                  defaultValue={blogDraft?.publishedAt ?? today()}
                  required
                />
              </label>
            </div>
            <label>
              <span>SEO description</span>
              <textarea
                name="seoDescription"
                rows={3}
                defaultValue={blogDraft?.seoDescription}
              />
            </label>
            <label>
              <span>Cover image</span>
              <input name="image" type="file" accept="image/*" />
              <small>Optional. Uploading a new image replaces the current one.</small>
            </label>
            <div className="admin-editor-actions">
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving…" : blogDraft ? "Update Blog" : "Publish Blog"}
              </button>
              {blogDraft && (
                <button
                  className="admin-secondary"
                  type="button"
                  onClick={() => setBlogDraft(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="admin-card admin-record-list">
            <div className="admin-card-heading">
              <span>02</span>
              <div>
                <p>Published Content</p>
                <h2>{content.blogs.length} blog posts</h2>
              </div>
            </div>
            {content.blogs.map((blog) => (
              <article key={blog.id}>
                {blog.coverImageUrl ? (
                  <Image
                    src={blog.coverImageUrl}
                    alt=""
                    width={160}
                    height={100}
                    unoptimized
                  />
                ) : (
                  <div className="admin-list-placeholder">Blog</div>
                )}
                <div>
                  <small>{blog.category} · {blog.publishedAt}</small>
                  <strong>{blog.title}</strong>
                  <span>/blog/{blog.slug}</span>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => setBlogDraft(blog)}>
                    Edit
                  </button>
                  <button
                    className="danger"
                    type="button"
                    onClick={() => removeRecord("blog", blog.id, blog.title)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="admin-manager-grid">
          <form
            className="admin-card admin-form admin-editor"
            key={customerDraft?.id ?? "new-customer"}
            onSubmit={submitContent}
          >
            <div className="admin-card-heading">
              <span>01</span>
              <div>
                <p>Happy Customer Manager</p>
                <h2>{customerDraft ? "Edit customer card" : "Add customer card"}</h2>
              </div>
            </div>
            <input name="kind" type="hidden" value="customer" />
            {customerDraft && (
              <input name="id" type="hidden" value={customerDraft.id} />
            )}
            <label>
              <span>Customer name</span>
              <input name="name" defaultValue={customerDraft?.name} required />
            </label>
            <label>
              <span>Card title</span>
              <input name="title" defaultValue={customerDraft?.title} required />
            </label>
            <label>
              <span>Customer story</span>
              <textarea
                name="story"
                rows={6}
                defaultValue={customerDraft?.story}
                required
              />
            </label>
            <div className="admin-field-row">
              <label>
                <span>Photo layout</span>
                <select
                  name="orientation"
                  defaultValue={customerDraft?.orientation ?? "landscape"}
                >
                  <option value="landscape">Landscape</option>
                  <option value="portrait">Portrait</option>
                </select>
              </label>
              <label>
                <span>Display order</span>
                <input
                  name="sortOrder"
                  type="number"
                  min={1}
                  defaultValue={customerDraft?.sortOrder ?? content.customers.length + 1}
                />
              </label>
            </div>
            <label>
              <span>Customer photo</span>
              <input name="image" type="file" accept="image/*" />
              <small>Use only customer-approved photos.</small>
            </label>
            <div className="admin-editor-actions">
              <button type="submit" disabled={isSaving}>
                {customerDraft ? "Update Customer" : "Publish Customer"}
              </button>
              {customerDraft && (
                <button
                  className="admin-secondary"
                  type="button"
                  onClick={() => setCustomerDraft(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <section className="admin-card admin-record-list">
            <div className="admin-card-heading">
              <span>02</span>
              <div>
                <p>Customer Cards</p>
                <h2>{content.customers.length} stories</h2>
              </div>
            </div>
            {content.customers.map((customer) => (
              <article key={customer.id}>
                {customer.imageUrl ? (
                  <Image
                    src={customer.imageUrl}
                    alt=""
                    width={160}
                    height={100}
                    unoptimized
                  />
                ) : (
                  <div className="admin-list-placeholder">Photo</div>
                )}
                <div>
                  <small>{customer.orientation} · order {customer.sortOrder}</small>
                  <strong>{customer.name}</strong>
                  <span>{customer.title}</span>
                </div>
                <div className="admin-row-actions">
                  <button type="button" onClick={() => setCustomerDraft(customer)}>
                    Edit
                  </button>
                  <button
                    className="danger"
                    type="button"
                    onClick={() => removeRecord("customer", customer.id, customer.name)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}

      {activeTab === "founder" && (
        <div className="admin-founder-stack">
          <form
            className="admin-card admin-form admin-editor"
            key={content.founder?.updatedAt ?? "founder"}
            onSubmit={submitContent}
          >
            <div className="admin-card-heading">
              <span>01</span>
              <div>
                <p>Founder Profile</p>
                <h2>Edit profile and picture</h2>
              </div>
            </div>
            <input name="kind" type="hidden" value="founder" />
            <div className="admin-field-row">
              <label>
                <span>Founder name</span>
                <input name="name" defaultValue={content.founder?.name} required />
              </label>
              <label>
                <span>Role</span>
                <input name="role" defaultValue={content.founder?.role} required />
              </label>
            </div>
            <label>
              <span>Main headline</span>
              <input
                name="headline"
                defaultValue={content.founder?.headline}
                required
              />
            </label>
            <label>
              <span>Founder biography</span>
              <textarea
                name="bio"
                rows={7}
                defaultValue={content.founder?.bio}
                required
              />
            </label>
            <label>
              <span>Founder picture</span>
              <input name="image" type="file" accept="image/*" />
            </label>
            <button type="submit" disabled={isSaving}>Update Founder Profile</button>
          </form>

          <div className="admin-manager-grid">
            <form
              className="admin-card admin-form admin-editor"
              key={projectDraft?.id ?? "new-project"}
              onSubmit={submitContent}
            >
              <div className="admin-card-heading">
                <span>02</span>
                <div>
                  <p>Project Journey</p>
                  <h2>{projectDraft ? "Edit project" : "Add project"}</h2>
                </div>
              </div>
              <input name="kind" type="hidden" value="project" />
              {projectDraft && (
                <input name="id" type="hidden" value={projectDraft.id} />
              )}
              <div className="admin-field-row">
                <label>
                  <span>Project stage</span>
                  <select name="stage" defaultValue={projectDraft?.stage ?? "Latest"}>
                    <option>Previous</option>
                    <option>Latest</option>
                    <option>Upcoming</option>
                  </select>
                </label>
                <label>
                  <span>Display order</span>
                  <input
                    name="sortOrder"
                    type="number"
                    min={1}
                    defaultValue={projectDraft?.sortOrder ?? content.projects.length + 1}
                  />
                </label>
              </div>
              <label>
                <span>Project title</span>
                <input name="title" defaultValue={projectDraft?.title} required />
              </label>
              <label>
                <span>Project status</span>
                <input name="status" defaultValue={projectDraft?.status} required />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  name="description"
                  rows={6}
                  defaultValue={projectDraft?.description}
                  required
                />
              </label>
              <label>
                <span>Project picture</span>
                <input name="image" type="file" accept="image/*" />
              </label>
              <div className="admin-editor-actions">
                <button type="submit" disabled={isSaving}>
                  {projectDraft ? "Update Project" : "Publish Project"}
                </button>
                {projectDraft && (
                  <button
                    className="admin-secondary"
                    type="button"
                    onClick={() => setProjectDraft(null)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <section className="admin-card admin-record-list">
              <div className="admin-card-heading">
                <span>03</span>
                <div>
                  <p>Project Cards</p>
                  <h2>{content.projects.length} projects</h2>
                </div>
              </div>
              {content.projects.map((project) => (
                <article key={project.id}>
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt=""
                      width={160}
                      height={100}
                      unoptimized
                    />
                  ) : (
                    <div className="admin-list-placeholder">Project</div>
                  )}
                  <div>
                    <small>{project.stage} · order {project.sortOrder}</small>
                    <strong>{project.title}</strong>
                    <span>{project.status}</span>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => setProjectDraft(project)}>
                      Edit
                    </button>
                    <button
                      className="danger"
                      type="button"
                      onClick={() => removeRecord("project", project.id, project.title)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
