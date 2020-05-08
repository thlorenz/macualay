const UNKNOWN = '<unknown>'

export type MacaulayPage = {
  results: {
    nextCursorMark: string
    content: BirdData[]
  }
}

export type BirdData = {
  userId: string
  catalogId: string
  assetId: string
  eBirdChecklistId: string

  userDisplayName: string

  location: string
  latitude: number
  longitude: number

  licenseType: LicenseType

  previewUrl: URL
  largeUrl: URL
  mediaUrl: URL
  // TODO: it seems like all thumbnails point to the same placeholder URL,
  // may not be needed
  thumbnailUrl: URL
  mediaDownloadUrl: URL
  specimenUrl: URL
  userProfileUrl: URL
  ebirdSpeciesUrl: URL
  eBirdChecklistUrl: URL

  rating: string
  ratingCount: string

  reportAs: string
  speciesCode: string
  sciName: string
  commonName: string

  width: number
  height: number

  exifData: ExifData
  mediaType: MediaType
  source: Source
}

export type URL = string
export type LicenseType = 'Any Lab Use=eBird'
export type MediaType = 'Photo'
export type Source = 'ebird'
export type ExifData = {
  exposure_time: string
  lens_model: string
  f_number: string
  focal_length: string
  iso: string
  mime_type: MIMEType
  create_dt: string
  model: string
  make: string
}
export const EXIF_DATA_DEFAULTS = {
  exposure_time: UNKNOWN,
  lens_model: UNKNOWN,
  f_number: UNKNOWN,
  focal_length: UNKNOWN,
  iso: UNKNOWN,
  mime_type: 'image/jpeg',
  create_dt: UNKNOWN,
  model: UNKNOWN,
  make: UNKNOWN,
}

// Specific Species:
//  curl --location --request GET 'https://api.ebird.org/v2/ref/taxonomy/ebird?species=zebdov'
// All Species:
//  curl --location --request GET 'https://api.ebird.org/v2/ref/taxonomy/ebird'
export type EbirdSpeciesData = {
  taxon_order: number
  sci_name_codes: string
  banding_codes: string
  ebird_order: string
  family_com_name: string
  family_sci_name: string
}

export const EMPTY_EBIRD_SPECIES_DATA = {
  taxon_order: 0,
  sci_name_codes: UNKNOWN,
  banding_codes: UNKNOWN,
  ebird_order: UNKNOWN,
  family_com_name: UNKNOWN,
  family_sci_name: UNKNOWN,
}

export type MIMEType = 'image/jpeg'

export type BirdDataRow = Exclude<BirdData, 'exifData'> &
  ExifData &
  EbirdSpeciesData
