# ── Stage 1: Build Go Binary ──────────────────────────────
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install git and ca-certificates for downloading dependencies
RUN apk add --no-cache git ca-certificates

# Copy dependency files first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Compile optimized standalone binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server ./cmd/server

# ── Stage 2: Minimal Runtime ──────────────────────────────
FROM alpine:3.20

WORKDIR /app

# Install ca-certificates and tzdata for HTTPS and accurate local times
RUN apk add --no-cache ca-certificates tzdata

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled binary from builder
COPY --from=builder /app/server /app/server
COPY --from=builder /app/.env.example /app/.env.example

# Set ownership
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8080

CMD ["/app/server"]
