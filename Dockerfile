FROM node:14.20.0-alpine3.16
WORKDIR /nestjs-test
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:debug"]
