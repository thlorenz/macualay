SELECT
    reportAs, speciesCode, sciName, commonName,
    ebird_order, family_com_name, family_sci_name,
    assetId, previewUrl
FROM bird_data
WHERE speciesCode LIKE '%%';
