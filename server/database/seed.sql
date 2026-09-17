-- ============================================================
-- Fairway Seed Data (development only)
-- ============================================================

-- Admin user: admin@fairway.com / Admin123!
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@fairway.com', '$2b$10$vBcvvhztNOcuI5uggxnnwOgNl8AIFZsuHH/UoYQBWDx9CP7sgDCFa', 'Fairway Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Test user: user@fairway.com / User123!
INSERT INTO users (email, password_hash, full_name, role) VALUES
('user@fairway.com', '$2b$10$vBcvvhztNOcuI5uggxnnwOgNl8AIFZsuHH/UoYQBWDx9CP7sgDCFa', 'Test User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Charities
INSERT INTO charities (name, description, image_url, category, active, total_funded) VALUES
('Youth Golf Foundation', 'Providing equipment, coaching, and life mentorship to underprivileged youth across the country.', 'https://images.unsplash.com/photo-1593111774240-d529f12eb416?q=80&w=600&auto=format&fit=crop', 'Youth Development', true, 14280000),
('Green Fairways Trust', 'Preserving wildlife corridors and planting native flora across golf sanctuaries and beyond.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=600&auto=format&fit=crop', 'Eco Reforestation', true, 9840000),
('Veterans In Motion', 'Adaptive golf programs assisting recovering service veterans with mobility rehab and community.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop', 'Physical Therapy', true, 11525000),
('Pure Water Initiative', 'Supplying durable solar filtration units to rural sports & youth camps in need.', 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?q=80&w=600&auto=format&fit=crop', 'Clean Water', true, 7690000)
ON CONFLICT DO NOTHING;
