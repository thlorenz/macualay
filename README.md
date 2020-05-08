# macaulay

Storing macaulay bird data into a sqlite database.

## Getting Data

Getting 100 results at a time

``` sh
cd modules/fetch
DEBUG='(process|db|fetch):(info|error)' ts-node src/fetch-data.ts
```

It tracks which cursors (pages) it visited and finishes automatically when it already has seen a page.
It appears that once the last page is reached macaulay points to the first page again.


### Scripts used to discover how to get data

```sh
# documenting how this was downloaded 30 results at a time

wget -O macaulay.01.json \
  'https://search.macaulaylibrary.org/catalog.json?userId=USER163746&count=100'
wget -O macaulay.02.json \
  'https://search.macaulaylibrary.org/catalog.json?userId=USER163746&cursorMark=AoJ49uDugfECKTIxNzM2MjQ3MQ&count=100'
wget -O macaulay.03.json \
  'https://search.macaulaylibrary.org/catalog.json?userId=USER163746&cursorMark=AoJwoN/xgfECKTIxNzM2NjI3MQ&count=100'
```

Optionally obtaining more info from ebird about first bird in macaulay.01.json (species: zebdov)

```sh
curl --location --request GET 'https://api.ebird.org/v2/ref/taxonomy/ebird?species=zebdov' \
  --header 'X-eBirdApiToken: <ebirdApiToken>' > zebdov.csv
```
