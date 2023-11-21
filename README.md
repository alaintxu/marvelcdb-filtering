# MarvelCDB filtering

## Reducir la carga de MarvelCDB

No me gustaría que marvelcdb se sature debido a esta aplicación, así que estas son las
Principales medidas tomadas para reducir la cantidad de llamadas a MarvelCDB:

* Las cartas se descargan al navegador (usando almacenamiento local).
* Advertencias cuando se borran las cartas y cuando se descargan todas las cartas.
* Las cartas están paginadas (no se muestran todas a la vez).
* Las imágenes se cargan de forma diferida, por lo que se descargan justo cuando son visibles.
* El filtrado se realiza contra una copia local de las cartas.

> La lista de packs siempre se descarga de MarvelCDB por si ha habido alguna actualización.
