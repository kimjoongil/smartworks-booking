This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



## NEXT.JS 13 패키지설치
npx create-next-app@latest ./ --ts --experimental-app

npm install classnames react-icons @mui/material
npm install react-select    //Select 박스 component
npm install date-fns
npm install react-hook-form

npm install react-date-range -D @types/react-date-range
X -- npm install react-time-range -D @types/react-time-range

npm install axios
npm install -D prisma @prisma/client
npm install next-auth @next-auth/prisma-adapter @auth/prisma-adapter
npm install bcrypt -D @types/bcrypt
npm install swr@latest
npm install zustand
npm install react-hot-toast

npm install query-string




## prisma 사용
npx prisma init --datasource-provider mysql
npx prisma db pull
npx prisma generate