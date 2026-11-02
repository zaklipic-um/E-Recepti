package com.example.backend.service;

import com.example.backend.model.Recept;
import com.example.backend.repository.ReceptRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Comparator;

//izvedba CRUD metod

@Service
public class ReceptService {

    private final ReceptRepository receptRepository;


    public ReceptService(ReceptRepository receptRepository) {
        this.receptRepository = receptRepository;
    }

    //CRUD METODE//////////////////////////////////////////////////////////

    //pridobivanje vseh receptov
    public List<Recept> getAllRecepti() {
        return receptRepository.findAll();
    }

    //VAJA3:
    // Uporabi vse podane filtre hkrati; prazen parameter pomeni, da ta kriterij ni aktiven.
    public List<Recept> getAllRecepti(String kategorija, Integer najvecjiCas, String sestavina, String razvrsti) {
        String iskanaKategorija = normaliziraj(kategorija);
        String iskanaSestavina = normaliziraj(sestavina);

        Comparator<Recept> vrstniRed = comparatorZa(razvrsti);

        return receptRepository.findAll().stream()
                .filter(recept -> iskanaKategorija.isEmpty()
                        || normaliziraj(recept.getKategorija()).equals(iskanaKategorija))
                .filter(recept -> najvecjiCas == null || najvecjiCas < 0
                        || recept.getCasPriprave() <= najvecjiCas)
                .filter(recept -> iskanaSestavina.isEmpty()
                        || recept.getSestavine().stream()
                        .anyMatch(item -> normaliziraj(item.getNaziv()).contains(iskanaSestavina)))
                // Razvrstitev sledi filtriranju, zato se urejajo samo zadetki.
                .sorted(vrstniRed)
                .toList();
    }

    //VAJA3
    // Dovoljene izbire razvrščanja so določene na strežniku; neznana vrednost ohrani privzeti vrstni red.
    private Comparator<Recept> comparatorZa(String razvrsti) {
        Comparator<Recept> poNazivu = Comparator.comparing(
                recept -> normaliziraj(recept.getNaziv()));
        Comparator<Recept> poCasu = Comparator.comparingInt(Recept::getCasPriprave);

        if ("nazivDesc".equals(razvrsti)) return poNazivu.reversed();
        if ("casAsc".equals(razvrsti)) return poCasu;
        if ("casDesc".equals(razvrsti)) return poCasu.reversed();
        return poNazivu;
    }

    //VAJA3
    // Poenoti velike/male črke in presledke, da filtri niso občutljivi na zapis.
    private String normaliziraj(String vrednost) {
        return vrednost == null ? "" : vrednost.trim().toLowerCase(Locale.forLanguageTag("sl"));
    }

    //pridobitev enega recepta po id
    public Recept getReceptById(Long id) {
        return receptRepository.findById(id).orElse(null);
    }

    //ustvarjanje novega recepta
    public Recept createRecept(Recept recept) {
        return receptRepository.save(recept);
    }

    //posodobitev existing recepta
    public Recept updateRecept(Long id, Recept novRecept) {
        Recept recept = receptRepository.findById(id).orElse(null);

        if (recept == null) {
            return null;
        }

        recept.setNaziv(novRecept.getNaziv());
        recept.setOpis(novRecept.getOpis());
        recept.setCasPriprave(novRecept.getCasPriprave());
        recept.setKategorija(novRecept.getKategorija());
        recept.setNavodilaPriprave(novRecept.getNavodilaPriprave());
        recept.setSestavine(novRecept.getSestavine());

        return receptRepository.save(recept);
    }

    //delete metoda (po ID-ju)
    public void deleteRecept(Long id) {
        receptRepository.deleteById(id);
    }
}
