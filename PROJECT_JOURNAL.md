# Project Journal (The chaos behind the build)
Hey folks 👋
Hope you’re doing great! This file documents my entire journey of building this project — from the thought process and mindset to the execution and iterations.

If you’re curious about how I approach building things, this journal is where you’ll find everything that goes beyond just the final project.


1. This is the initial setup phase of the project, where I started by initializing it with the latest version of Next.js. Moving forward, I configured the Neon database (PostgreSQL) and installed Prisma for database management.

2. Following the project references, my current focus is on setting up Prisma and defining a few models in the `schema.prisma` file as the first step in structuring the database.
However, while setting up the `Prisma Client`, I encountered an import error. Even though I’m following the references closely, it seems there might be an issue caused by recent updates — so I’ll need to investigate it further.

3. After spending two hours i got the fix of `prisma client` import issue and which is becasue of some updates and since i am using it after a long time after running the command `npm install @prisma/client` will install the client and then after running the command `npx prisma generate` it will generate the prism client inside of the `app` folder.....(at least in my opinion)

Throughtout the process of debugging i just refered docs and docs and docs ..... (garnished with copilot 😅)


