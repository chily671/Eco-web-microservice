FROM node

WORKDIR /app/orders

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 5002

CMD ["npm", "start"]