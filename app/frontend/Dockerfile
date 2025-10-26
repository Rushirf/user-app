#--------------------------------Build Stage---------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

#---------------------------------Run Stage------------------------------------------------------
# Adding runtime

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app .

EXPOSE 4000

CMD [ "npm","start" ]