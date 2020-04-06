export const BIRD_DATA_TABLE = 'bird_data'
export const createBirdDataTable = `
DROP TABLE IF EXISTS ${BIRD_DATA_TABLE};

CREATE TABLE IF NOT EXISTS bird_data (
  -- IDs
  assetId TEXT NOT NULL PRIMARY KEY,

  userId TEXT NOT NULL,
  catalogId TEXT NOT NULL,
  ebirdChecklistId TEXT,

  userDisplayName TEXT NOT NULL,

  -- Location
  location TEXT NOT NULL,
  latitude INTEGER,
  longitude INTEGER,

  -- URLs
  previewUrl TEXT NOT NULL,
  largeUrl TEXT NOT NULL,
  mediaUrl TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  mediaDownloadUrl TEXT NOT NULL,
  specimenUrl TEXT NOT NULL,
  userProfileUrl TEXT NOT NULL,
  ebirdSpeciesUrl TEXT NOT NULL,
  eBirdChecklistUrl TEXT NOT NULL,

  -- Rating
  rating TEXT,
  ratingCount TEXT,

  -- Bird Info
  reportAs TEXT NOT NULL,
  speciesCode TEXT NOT NULL,
  sciName TEXT NOT NULL,
  commonName TEXT NOT NULL,


  -- Image Info
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,

  -- ExifData
  exposure_time TEXT,
  lens_model TEXT,
  f_number TEXT,
  focal_length TEXT,
  iso TEXT,
  mime_type TEXT,
  create_dt TEXT,
  model TEXT,
  make TEXT,

  -- Misc
  mediaType TEXT,
  source TExT,
  licenseType TEXT NOT NULL

) WITHOUT ROWID;
`
