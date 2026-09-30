// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
export {};
import {sqliteTable, text, integer, primaryKey} from 'drizzle-orm/sqlite-core';
export const newsOrder = sqliteTable('news_order', {
 id: text('id').primaryKey(),
 slugs: text('slugs').notNull(),
});

export const news = sqliteTable('news', {
  slug: text('slug').primaryKey(),
  category: integer('category').notNull().default(0),
  title: text('title').notNull(),
  description: text('description').notNull(),
  body: text('body').notNull().default('{}'),
  image: text('image'),
  gallery: text('gallery').notNull().default('[]'),
  source: text('source'),
  status: text('status').notNull().default('published'),
  updatedAt: text('updated_at').notNull(),
});

export const pageContent = sqliteTable('page_content', {
  page: text('page').notNull(),
  locale: text('locale').notNull(),
  title: text('title').notNull().default(''),
  description: text('description').notNull().default(''),
  image: text('image'),
  updatedAt: text('updated_at').notNull(),
}, table => [primaryKey({columns:[table.page,table.locale]})]);
