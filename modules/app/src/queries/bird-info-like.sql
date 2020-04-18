SELECT reportAs, speciesCode, sciName, commonName, assetId, previewUrl
FROM bird_data
WHERE speciesCode LIKE '%%';
