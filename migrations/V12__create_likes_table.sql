-- Likes Table
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Use UUID for primary key
    post_id UUID NOT NULL, -- Foreign key referencing the posts table
    user_id UUID NOT NULL, -- Use UUID for user IDs
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (post_id, user_id), -- Ensure a user can like a post only once
    CONSTRAINT fk_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);