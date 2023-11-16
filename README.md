# marvelcdb-filtering
MarvelCDB filtering web app.

Thanks to MarvelCDB for the work and excelent application.

## Reducing the load of MarvelCDB

I wouldn't like marvelcdb to saturate due to this app, so this are the 
main things done to reduce the amount of calls to MarvelCDB:

* Cards are downloaded to the browser (using local storage).
* Warnings when cards are removed and when all pack cards are loaded.
* Images are paginated.
* Images are lazy loaded, so they are downloaded just when they are visible.
* Filtering is done against local list of cards.

Pack list is always downloaded.
