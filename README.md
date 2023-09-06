# Supabase + Next.js Test

This repo contains the code for the test provided by [Bogdan Serebryakov](https://github.com/Bogdan1001) through Upwork.

## Step to run this locally.

To run the application locally, you need to have Supabase setup either on the local or has an account on cloud.

Copy `.env.local.example` to `.env.local` and set the value for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This is imported to start the application.

### Commands

This repo uses `pnpm` as the package manager to install the dependencies, but you can also use `npm` or `yarn` for now, as it's new, and lock file doesn't matter much.

Install all the dependencies

```bash
pnpm install
```

Start development server

```bash
pnpm run dev
```

This should start the application on [localhost](http://localhost:3000)

Side Note: This application uses, realtime subscription from supabase to show realtime data. So make sure to enable webhooks for `skills` table is supabase dashboard. Otherwise, you won't see updates in realtime on the UI.
