# Gunakan Node.js versi 22.12
FROM node:22.12

# Tetapkan direktori kerja di container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk menginstal dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Salin semua file proyek ke container
COPY . .

# Ekspose port default Vite (5173)
EXPOSE 5173

# Jalankan perintah untuk development
CMD ["npm", "run", "dev", "--", "--host"]