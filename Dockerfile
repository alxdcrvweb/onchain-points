FROM node:21.6.2-bullseye-slim as build
ENV TZ=Europe/Moscow

# that will be empty

WORKDIR /app
# jest.config.js
# package.json
# tsconfig.json
# tsconfig.node.json
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.node.json ./
COPY tsconfig.json ./
COPY vite.config.mts ./
COPY public ./public
COPY index.html ./
COPY src ./src

RUN npm install -g npm@10.4.0
RUN npm cache clean --force 
RUN npm config set strict-ssl false
RUN npm config set proxy null
RUN npm config set https-proxy null
RUN npm config set registry http://registry.npmjs.org/
RUN npm config set fetch-retries 3 
RUN npm i --fetch-timeout=60000 


RUN npm run check
RUN npm run build

FROM busybox:1.35
ENV TZ=Europe/Moscow
# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static
COPY --from=build /app/dist /home/static
EXPOSE 8108
CMD ["busybox", "httpd", "-f", "-v", "-p", "8108"]
# CMD [ "npm", "run", "dev" ]
