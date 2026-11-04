# E-Recepti

Aplikacija za shranjevanje, pregledovanje in urejanje kuhinjskih receptov.

## Kazalo

- [O projektu](#o-projektu)
- [Uporabljene tehnologije](#uporabljene-tehnologije)
- [Struktura projekta](#struktura-projekta)
- [Nameščanje in zagon](#nameščanje-in-zagon)
- [Navodila za razvijalce](#navodila-za-razvijalce)
- [Standardi kodiranja](#standardi-kodiranja)

## O projektu

E-Recepti omogoča uporabniku, da na enem mestu vodi zbirko receptov. Recept vsebuje ime, kategorijo, čas priprave, opis, seznam sestavin s količinami in navodila za pripravo. Uporabnik lahko recepte dodaja, pregleduje, ureja in briše, išče po imenu, opisu ali sestavinah ter filtrira in razvršča rezultate.

Sistem je sestavljen iz treh delov:

1. **Frontend** prikaže uporabniški vmesnik v brskalniku.
2. **Express strežnik** postreže statične datoteke in posreduje zahteve na zaledni API.
3. **Spring Boot backend** izvaja REST API in shranjuje podatke v PostgreSQL.

## Uporabljene tehnologije

| Del | Tehnologija | Različica / opomba |
| --- | --- | --- |
| Backend | Java | 25 |
| Backend | Spring Boot | 4.1.1 |
| Backend | Spring Data JPA / Hibernate | Različico upravlja Spring Boot 4.1.1 |
| Backend | Spring Web MVC | Različico upravlja Spring Boot 4.1.1 |
| Backend | Springdoc OpenAPI | 3.1.1; dokumentacija API-ja in Swagger UI |
| Backend | PostgreSQL JDBC driver | Različico upravlja Spring Boot; strežniška različica PostgreSQL v projektu ni določena |
| Backend | H2 | Runtime odvisnost, trenutno ni privzeta baza aplikacije |
| Backend | Maven Wrapper | Maven 3.9.16, Maven Wrapper 3.3.4 |
| Frontend strežnik | Node.js | 18 ali novejši (uporablja vgrajeni `fetch`) |
| Frontend strežnik | Express | 5.1.0 |
| Frontend | HTML, CSS in JavaScript | Brez dodatnega frontend ogrodja |
| Orodja | Git, GitHub, Postman | Za različice glej nameščene različice okolja |


## Struktura projekta

```text
RIS_Projekt/
├── README.md                            # Opis projekta in navodila
├── backend/
│   ├── pom.xml                          # Java/Maven odvisnosti in nastavitev
│   ├── mvnw, mvnw.cmd                   # Maven Wrapper za macOS/Linux in Windows
│   └── src/
│       ├── main/java/com/example/backend/
│       │   ├── config/                  # Nastavitve OpenAPI
│       │   ├── controller/              # REST končne točke
│       │   ├── model/                   # Entiteti Recept in Sestavina
│       │   ├── repository/              # Dostop do podatkov prek JPA
│       │   ├── service/                 # Poslovna logika receptov
│       │   └── BackendApplication.java
│       ├── main/resources/
│       │   └── application.properties   # Nastavitve aplikacije in povezave z bazo
│       └── test/                        # Backend testi
├── frontend/
│   ├── server.js                        # Express strežnik in posrednik API zahtev
│   ├── package.json                     # Frontend odvisnosti in ukazi
│   └── public/                          # HTML, CSS in JavaScript za brskalnik
├── slike/                               # Slike, ki jih uporablja aplikacija
├── posnetki_zaslona_CRUD/               # Posnetki preverjanja CRUD operacij
├── postman/                             # Postman konfiguracija
├── Query1.sql                           # Primer SQL poizvedbe
└──razna_dokumentacija/
    ├──filtriranje.md                    # Zapis o naprednem filtriranju
    └──Lipic_vaja1.md                    # Gradivo oziroma zapis vaje
```

## Nameščanje in zagon

### Predpogoji

- Java Development Kit (JDK) 25.
- Node.js 18 ali novejši in npm.
- PostgreSQL, dostopen na `localhost:5432`.
- Git za delo z izvornim repozitorijem.

Maven Wrapper je vključen, zato ločena namestitev Mavena ni potrebna.

### 1. Pripravi PostgreSQL

Ustvari podatkovno bazo `recepti` in uporabnika `recepti_user`. V `psql` kot skrbnik baze izvedi (zamenjaj primer gesla z lastnim):

```sql
CREATE ROLE recepti_user WITH LOGIN PASSWORD 'izberi-lokalno-geslo';
CREATE DATABASE recepti OWNER recepti_user;
```

Če baza ali uporabnik že obstajata, ta korak preskoči oziroma uporabi svoje obstoječe podatke za povezavo.

### 2. Nastavi okoljske spremenljivke

Backend privzeto uporablja naslov `jdbc:postgresql://localhost:5432/recepti` in uporabniško ime `recepti_user`. Geslo se poda prek okoljske spremenljivke; v repozitorij ga ne zapisuj.

macOS/Linux, v terminalu, iz katerega bo zagnan backend:

```sh
export DB_USERNAME=recepti_user
export DB_PASSWORD='izberi-lokalno-geslo'
```

Windows PowerShell:

```powershell
$env:DB_USERNAME = "recepti_user"
$env:DB_PASSWORD = "izberi-lokalno-geslo"
```

Spremenljivki nastavi v istem terminalu, v katerem zaženeš backend. Za drugačen naslov baze uredi `spring.datasource.url` v `backend/src/main/resources/application.properties`.

### 3. Zaženi backend

V prvem terminalu:

```sh
cd backend
./mvnw spring-boot:run
```

V Windows PowerShell uporabi `.\mvnw.cmd spring-boot:run` namesto ukaza `./mvnw`. Backend se privzeto zažene na `http://localhost:8080`.

### 4. Zaženi frontend

V drugem terminalu:

```sh
cd frontend
npm install
npm start
```

Odpri [http://localhost:3000](http://localhost:3000). Frontend privzeto pošilja API zahteve na `http://localhost:8080`. Če backend teče na drugem naslovu ali vratih, pred `npm start` nastavi `BACKEND_URL`, na primer:

```sh
BACKEND_URL=http://localhost:8081 npm start
```

Vrata frontend strežnika lahko spremeniš z okoljsko spremenljivko `PORT` (privzeto `3000`). Zaustavi strežnika s `Ctrl+C` v njunih terminalih.

## Navodila za razvijalce

Projektni repozitorij: [zaklipic-um/E-Recepti](https://github.com/zaklipic-um/E-Recepti).

Priporočen potek dela:

1. Sinhroniziraj lokalno vejo z `main`.
2. Za spremembo ustvari svojo vejo, na primer `feature/iskanje-receptov` ali `fix/napaka-pri-filtru`.
3. Spremembo naredi v ustreznem delu (`frontend/` ali `backend/`) in jo lokalno preveri.
4. Dodaj samo povezane datoteke, napiši kratek opisni commit in objavi vejo na GitHub.
5. Odpri Pull Request proti `main`, opiši spremembe in počakaj na pregled sodelavca.
6. Po združitvi osveži lokalni `main` in izbriši zaključeno vejo.

Primer ukazov za novo vejo in commit:

```sh
git switch main
git pull
git switch -c feature/ime-spremembe
git add <datoteke>
git commit -m "Opiši spremembo"
git push -u origin feature/ime-spremembe
```
Za lažje delo uporabljaj GitHub Desktop.

Ne dodajaj gesel, dostopnih žetonov, osebnih podatkov, `frontend/node_modules/` ali generiranih datotek. Pred commitom preglej `git status` in spremembe v GitHub Desktopu.

## Standardi kodiranja

- Imena razredov v Javi piši v `PascalCase`, metode in spremenljivke v `camelCase`, pakete pa z malimi črkami.
- Java kodo zamikaj s štirimi presledki; JavaScript, HTML in CSS z dvema presledkoma.
- Uporabljaj jasna in opisna imena ter odstrani neuporabljene uvoze in začasno kodo.
- REST krmilnike ohranjaj osredotočene na HTTP zahteve; poslovno logiko dodajaj v `service`, dostop do podatkov pa v `repository`.
- Pri spremembah API-ja posodobi pripadajočo dokumentacijo OpenAPI in po potrebi frontend.
- Uporabniške vrednosti pri izpisu v HTML ustrezno ubeži; vmesnik že uporablja funkcijo `escapeHtml`.
- Commiti naj bodo majhni, povezani z eno spremembo in opisani z jasnim sporočilom.
