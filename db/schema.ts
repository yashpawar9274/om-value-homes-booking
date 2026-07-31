import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const flatTours = sqliteTable("flat_tours", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  bhkLabel: text("bhk_label").notNull(),
  objectKey: text("object_key").notNull(),
  fileName: text("file_name").notNull(),
  contentType: text("content_type").notNull(),
  fileSize: integer("file_size").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const contentMeta = sqliteTable("content_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const blogPostRecords = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  body: text("body").notNull(),
  seoTitle: text("seo_title").notNull(),
  seoDescription: text("seo_description").notNull(),
  coverObjectKey: text("cover_object_key"),
  coverContentType: text("cover_content_type"),
  publishedAt: text("published_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const founderProfiles = sqliteTable("founder_profiles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  imageObjectKey: text("image_object_key"),
  imageContentType: text("image_content_type"),
  updatedAt: text("updated_at").notNull(),
});

export const founderProjectRecords = sqliteTable("founder_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  stage: text("stage").notNull(),
  title: text("title").notNull(),
  status: text("status").notNull(),
  description: text("description").notNull(),
  imageObjectKey: text("image_object_key"),
  imageContentType: text("image_content_type"),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const customerStoryRecords = sqliteTable("customer_stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  title: text("title").notNull(),
  story: text("story").notNull(),
  orientation: text("orientation").notNull(),
  imageObjectKey: text("image_object_key"),
  imageContentType: text("image_content_type"),
  sortOrder: integer("sort_order").notNull(),
  updatedAt: text("updated_at").notNull(),
});
