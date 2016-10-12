CREATE TABLE IF NOT EXISTS test.addons (
    id SERIAL PRIMARY KEY,
    url VARCHAR(256) UNIQUE
);

CREATE TABLE IF NOT EXISTS test.results (
    id SERIAL PRIMARY KEY,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    addon_id INT REFERENCES addons (id) NOT NULL,
    version TEXT NOT NULL,
    compatible BOOLEAN NOT NULL,
    comment TEXT,
    session VARCHAR(32)
);
