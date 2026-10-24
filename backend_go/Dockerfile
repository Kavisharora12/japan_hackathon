# ── Stage 1: Build Go Binary ──────────────────────────────
FROM golang:1.24-alpine AS builder

WORKDIR /app

ENV CGO_ENABLED=0 \
    GOOS=linux

# Copy all source code including vendored dependencies
COPY . .

# Compile optimized standalone binary directly from vendor (0 network downloads required)
RUN go build -mod=vendor -ldflags="-s -w" -o /app/server ./cmd/server

# ── Stage 2: Minimal Runtime ──────────────────────────────
FROM alpine:3.20

WORKDIR /app

# Install ca-certificates and timezone data
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
