# macaulay

Storing macaulay bird data into a sqlite database.

## Getting Data

Getting 30 results at a time

```sh
# documenting how this was downloaded 30 results at a time

wget -O macaulay.01.json \
  'https://search.macaulaylibrary.org/catalog.json?userId=USER163746'
wget -O macaulay.02.json \
  'https://search.macaulaylibrary.org/catalog.json?userId=USER163746&cursorMark=AoJ49uDugfECKTIxNzM2MjQ3MQ'
wget -O macaulay.03.json \
  'https://search.macaulaylibrary.org/catalog.json?userId=USER163746&cursorMark=AoJwoN/xgfECKTIxNzM2NjI3MQ'
```

Optionally obtaining more info from ebird about first bird in macaulay.01.json (species: zebdov)

```sh
curl --location --request GET 'https://api.ebird.org/v2/ref/taxonomy/ebird?species=zebdov' \
  --header 'X-eBirdApiToken: <ebirdApiToken>' > zebdov.csv
```
