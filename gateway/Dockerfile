FROM node

WORKDIR /app/gateway

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5555

CMD ["npm", "start"]