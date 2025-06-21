-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Disasters Table
CREATE TABLE disasters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location_name TEXT,
    location GEOGRAPHY(POINT, 4326),
    description TEXT,
    tags TEXT[],
    owner_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    audit_trail JSONB
);

-- Reports Table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    user_id TEXT,
    content TEXT,
    image_url TEXT,
    verification_status TEXT DEFAULT 'pending', -- pending, verified, fake
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources Table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    disaster_id UUID REFERENCES disasters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location_name TEXT,
    location GEOGRAPHY(POINT, 4326),
    type TEXT, -- e.g., shelter, medical, food, water
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache Table
CREATE TABLE cache (
    key TEXT PRIMARY KEY,
    value JSONB,
    expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX resources_location_idx ON resources USING GIST (location);
CREATE INDEX disasters_tags_idx ON disasters USING GIN (tags);
CREATE INDEX disasters_owner_id_idx ON disasters (owner_id);

-- Log table for structured logging
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    level TEXT, -- e.g., INFO, WARN, ERROR
    message TEXT,
    meta JSONB
);

-- Function to add audit trail entries
CREATE OR REPLACE FUNCTION add_audit_trail()
RETURNS TRIGGER AS $$
DECLARE
    audit_entry JSONB;
BEGIN
    audit_entry := jsonb_build_object(
        'action', TG_OP,
        'user_id', NEW.owner_id,
        'timestamp', NOW()
    );
    
    IF TG_OP = 'INSERT' THEN
        NEW.audit_trail := jsonb_build_array(audit_entry);
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.audit_trail := NEW.audit_trail || audit_entry;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update audit trail on disaster changes
CREATE TRIGGER disasters_audit_trigger
BEFORE INSERT OR UPDATE ON disasters
FOR EACH ROW EXECUTE FUNCTION add_audit_trail();

-- Function for geospatial queries
CREATE OR REPLACE FUNCTION find_resources_within_radius(lat float, long float, radius integer)
RETURNS SETOF resources AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM resources
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(long, lat), 4326),
        radius
    );
END;
$$ LANGUAGE plpgsql;
