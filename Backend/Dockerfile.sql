# Use the official MySQL 8.0 image as the base
FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=branchflowdb

# Copy the SQL dump into the image
COPY branchflowdb.sql /docker-entrypoint-initdb.d/
