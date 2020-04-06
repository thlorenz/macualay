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

export type MIMEType = 'image/jpeg'

export type BirdDataRow = Exclude<BirdData, 'exifData'> & ExifData

// Example requet to obtain data:
//curl --location --request GET 'https://api.ebird.org/v2/ref/taxonomy/ebird?species=zebdov'
export type EbirdSpecies = {
  // skipping first 3 columns (scientific name, common name, species code)
  // Column (0 based)
  /* 3 */ category: 'species'
  /* 4 */ taxon_order: number
  /* 5 */ com_name_codes: string
  /* 6 */ sci_name_codes: string
  /* 7 */ banding_codes: string
}
