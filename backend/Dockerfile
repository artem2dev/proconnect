FROM node:18.20.5

WORKDIR /app

# Копируем только package.json и yarn.lock из папки client
COPY ./package*.json ./

# Устанавливаем зависимости
RUN yarn install

# Копируем все остальные файлы из папки client
COPY . . 

# Создаем сборку
RUN yarn build

# Указываем команду по умолчанию для запуска
CMD ["yarn", "start"]
