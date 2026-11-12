# Xpert Mind

Professional blog platform with a public site and an admin dashboard for writing posts. Insert images and icons between paragraphs in the editor.

## Quick start

```bash
cd xpert-mind
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin dashboard

- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- Default password: `xpertmind123`

Change these in `.env.local` before sharing the app:

```
ADMIN_PASSWORD=your-strong-password
SESSION_SECRET=a-long-random-secret
```

## Features

- Public blog home and post pages
- Admin login with cookie session
- Create / edit / publish / unpublish / delete posts
- TipTap editor with bold, headings, lists
- Upload images into mid-content
- Insert Lucide icons between blocks
- Posts stored as JSON in `data/posts/`
- Uploads stored in `public/uploads/`

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — run production server
