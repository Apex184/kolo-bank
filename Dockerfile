FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN yarn install --production --silent
COPY . .
EXPOSE 3000
CMD ["yarn", "dev"]
