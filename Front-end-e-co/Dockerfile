FROM node

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --only=production
# RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]