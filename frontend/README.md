# Uporabniški vmesnik za recepte

Frontend je ločen Node.js/Express projekt. Datoteke zaledja ostanejo v `backend/`; brskalnik pošilja zahteve Express strežniku, ta pa jih posreduje Spring Boot API-ju. Tako frontend in backend tečeta kot ločena strežnika.

## Zagon

V enem terminalu zaženi zaledje v mapi `backend` (Spring Boot, privzeto vrata 8080). V drugem terminalu:

```sh
cd frontend
npm install
npm start
```

Odpri `http://localhost:3000`. Če zaledje teče drugje, nastavi `BACKEND_URL`, na primer `BACKEND_URL=http://localhost:8081 npm start`. Vrata Express strežnika je mogoče spremeniti z `PORT`.

Vmesnik podpira pregled, iskanje po receptih in sestavinah, filtriranje po kategoriji, ogled podrobnosti ter ustvarjanje, urejanje in brisanje receptov.
