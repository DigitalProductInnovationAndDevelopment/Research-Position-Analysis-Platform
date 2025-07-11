FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV REACT_APP_BACKEND_URL=http://backend:4000
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/build .
EXPOSE 80
ENV REACT_APP_BACKEND_URL=http://backend:4000
CMD ["nginx", "-g", "daemon off;"]
