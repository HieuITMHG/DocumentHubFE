# client/Dockerfile.dev

FROM node:20-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json để tận dụng cache
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Sao chép phần còn lại của source code
COPY . .

# Mở cổng dev server
EXPOSE 5173

# Cấu hình để dev realtime
CMD ["npm", "run", "dev", "--", "--host"]
