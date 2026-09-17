-- ============================================================
-- Fairway Full Schema  (run this against your PostgreSQL db)
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  full_name       VARCHAR(255),
  role            VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Charities
CREATE TABLE IF NOT EXISTS charities (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  image_url       VARCHAR(1024),
  category        VARCHAR(100),
  website_url     VARCHAR(1024),
  active          BOOLEAN DEFAULT true,
  total_funded    BIGINT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id      VARCHAR(255),
  stripe_subscription_id  VARCHAR(255),
  plan                    VARCHAR(50) CHECK (plan IN ('monthly', 'yearly')),
  status                  VARCHAR(50) DEFAULT 'inactive'
                            CHECK (status IN ('active', 'inactive', 'lapsed', 'cancelled')),
  selected_charity_id     UUID REFERENCES charities(id),
  charity_percentage      INTEGER DEFAULT 10
                            CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  renewal_date            TIMESTAMPTZ,
  monthly_amount_cents    INTEGER DEFAULT 25000,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Scores
CREATE TABLE IF NOT EXISTS scores (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  score_date      DATE NOT NULL,
  stableford      INTEGER NOT NULL CHECK (stableford >= 1 AND stableford <= 45),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, score_date)
);

-- Draws
CREATE TABLE IF NOT EXISTS draws (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_month                INTEGER NOT NULL CHECK (draw_month >= 1 AND draw_month <= 12),
  draw_year                 INTEGER NOT NULL,
  draw_date                 DATE NOT NULL,
  status                    VARCHAR(50) DEFAULT 'pending'
                              CHECK (status IN ('pending', 'simulated', 'published')),
  total_prize_pool_cents    BIGINT DEFAULT 0,
  match5_pool_cents         BIGINT DEFAULT 0,
  match4_pool_cents         BIGINT DEFAULT 0,
  match3_pool_cents         BIGINT DEFAULT 0,
  jackpot_rollover_cents    BIGINT DEFAULT 0,
  winning_numbers           INTEGER[] DEFAULT '{}',
  eligible_entries          INTEGER DEFAULT 0,
  simulated_at              TIMESTAMPTZ,
  published_at              TIMESTAMPTZ,
  created_by                UUID REFERENCES users(id),
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_month, draw_year)
);

-- Draw Entries (one per active subscriber per draw)
CREATE TABLE IF NOT EXISTS draw_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id         UUID REFERENCES draws(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  ticket_numbers  INTEGER[] NOT NULL,
  matches         INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(draw_id, user_id)
);

-- Winners
CREATE TABLE IF NOT EXISTS winners (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id         UUID REFERENCES draws(id) ON DELETE CASCADE,
  draw_entry_id   UUID REFERENCES draw_entries(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  match_tier      INTEGER NOT NULL CHECK (match_tier IN (3, 4, 5)),
  prize_amount_cents BIGINT NOT NULL,
  status          VARCHAR(50) DEFAULT 'pending'
                    CHECK (status IN ('pending', 'verified', 'rejected', 'paid')),
  admin_notes     TEXT,
  verified_by     UUID REFERENCES users(id),
  verified_at     TIMESTAMPTZ,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Winner Proofs
CREATE TABLE IF NOT EXISTS winner_proofs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_id       UUID UNIQUE REFERENCES winners(id) ON DELETE CASCADE,
  file_url        VARCHAR(1024) NOT NULL,
  original_name   VARCHAR(255),
  uploaded_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_scores_user_date ON scores(user_id, score_date DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_draw_entries_draw ON draw_entries(draw_id);
CREATE INDEX IF NOT EXISTS idx_winners_user ON winners(user_id);
CREATE INDEX IF NOT EXISTS idx_winners_draw ON winners(draw_id);

-- ============================================================
-- Updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_scores_updated_at
  BEFORE UPDATE ON scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_charities_updated_at
  BEFORE UPDATE ON charities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
