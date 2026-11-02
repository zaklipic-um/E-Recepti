# Poročilo: podrobno filtriranje receptov

## Kaj je bilo dodano

- V uporabniški vmesnik je dodan razdelek **Podrobno filtriranje** z ločenimi polji za kategorijo, največji čas priprave in sestavino.
- Napredni seznam kategorij se sestavi iz kategorij, ki se pojavijo v receptih. Ob spremembi drugih filtrov ostanejo že odkrite kategorije na voljo.
- Gumb **Počisti filtre** odstrani vse napredne kriterije in znova prikaže recepte brez teh omejitev.
- API `GET /api/recepti` sprejme neobvezne parametre `kategorija`, `najvecjiCas` in `sestavina`. Parametri se lahko pošljejo skupaj.
- Zaledje filtrira kategorijo brez razlikovanja med velikimi in malimi črkami, omeji čas priprave na izbrano vrednost in išče iskano besedilo med imeni sestavin.
- Dodani so komentarji ob novi logiki, ki pojasnjujejo namen filtrov, povezavo z API-jem in preprečevanje uporabe zastarelih odgovorov.
- Dodana je izbira razvrščanja po imenu A–Ž/Ž–A in času priprave od najkrajšega/najdaljšega.
- Zaledje rezultate najprej filtrira in nato razvrsti. API sprejme parameter `razvrsti` z vrednostmi `nazivAsc`, `nazivDesc`, `casAsc` ali `casDesc`.

## Kaj je ostalo enako

- Obstoječe besedilno iskanje po imenu, opisu in sestavinah ostaja nespremenjeno.
- Obstoječi hitri filter popularnih kategorij ostaja ločen in deluje kot prej.
- Dodajanje, ogled, urejanje in brisanje receptov niso bili odstranjeni ali preurejeni.

## Kaj je bilo spremenjeno

- Pridobivanje seznama receptov v zaledju sedaj lahko poleg običajnega seznama vrne tudi rezultate, omejene z naprednimi filtri.
- Klici iz uporabniškega vmesnika pošljejo napredne kriterije kot parametre API-ja; ob vnosu se seznam osveži.
- Dodani so prilagodljivi slogi za prikaz naprednih filtrov na večjih in manjših zaslonih.
- Izbrani vrstni red se pošlje skupaj z naprednimi filtri, zato ostane uporabljen tudi ob iskanju in hitrem filtru popularnih kategorij.

