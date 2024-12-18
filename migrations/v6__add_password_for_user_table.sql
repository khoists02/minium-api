alter table users add "password" varchar not null;

-- Add a composite unique constraint on username and email
ALTER TABLE users
ADD CONSTRAINT unique_username_email UNIQUE (name, email);