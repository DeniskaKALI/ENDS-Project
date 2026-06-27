CREATE TABLE IF NOT EXISTS user_accounts (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('USER', 'DISPATCHER', 'LOGIST', 'ADMIN', 'MANAGER', 'DRIVER')),
    company VARCHAR(180) NOT NULL
);

CREATE TABLE IF NOT EXISTS monitored_entities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    type VARCHAR(80) NOT NULL,
    status VARCHAR(80) NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_monitored_entities_search ON monitored_entities (name, type, status);

CREATE TABLE IF NOT EXISTS transport (
    id BIGSERIAL PRIMARY KEY,
    plate_number VARCHAR(32) NOT NULL UNIQUE,
    model VARCHAR(120) NOT NULL,
    driver VARCHAR(160) NOT NULL,
    type VARCHAR(80) NOT NULL,
    status VARCHAR(32) NOT NULL,
    speed INT NOT NULL CHECK (speed BETWEEN 0 AND 160),
    fuel INT NOT NULL CHECK (fuel BETWEEN 0 AND 100),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS routes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    start_point VARCHAR(160) NOT NULL,
    end_point VARCHAR(160) NOT NULL,
    status VARCHAR(32) NOT NULL,
    vehicle_id BIGINT REFERENCES transport(id) ON DELETE SET NULL,
    eta VARCHAR(80) NOT NULL,
    progress INT NOT NULL CHECK (progress BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS tracking_snapshots (
    id BIGSERIAL PRIMARY KEY,
    transport_id BIGINT NOT NULL REFERENCES transport(id) ON DELETE CASCADE,
    route_id BIGINT REFERENCES routes(id) ON DELETE SET NULL,
    latitude NUMERIC(9, 6) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(9, 6) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    speed INT NOT NULL CHECK (speed BETWEEN 0 AND 160),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT REFERENCES routes(id) ON DELETE SET NULL,
    title VARCHAR(180) NOT NULL,
    distance_km INT NOT NULL CHECK (distance_km >= 0),
    average_speed INT NOT NULL CHECK (average_speed >= 0),
    stops INT NOT NULL CHECK (stops >= 0),
    deviations INT NOT NULL CHECK (deviations >= 0),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    transport_id BIGINT REFERENCES transport(id) ON DELETE CASCADE,
    route_id BIGINT REFERENCES routes(id) ON DELETE CASCADE,
    author_id BIGINT REFERENCES user_accounts(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (transport_id IS NOT NULL OR route_id IS NOT NULL)
);
