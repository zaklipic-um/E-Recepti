package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

//glavni del

@Entity
public class Recept {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Enolični ID recepta", accessMode = Schema.AccessMode.READ_ONLY, example = "1")
    private Long id;

    @Schema(description = "Ime recepta", example = "Zelenjavna juha")
    private String naziv;
    @Schema(description = "Kratek opis recepta", example = "Preprosta domača juha")
    private String opis;
    @Schema(description = "Čas priprave v minutah", example = "35")
    private int casPriprave;
    @Schema(description = "Kategorija recepta", example = "Juha")
    private String kategorija;
    @Schema(description = "Navodila za pripravo")
    private String navodilaPriprave;

    @Schema(description = "Sestavine recepta z njihovimi količinami")
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recept_sestavine", joinColumns = @JoinColumn(name = "recept_id"))
    private List<Sestavina> sestavine = new ArrayList<>();

    public Recept() {
    }

    public Long getId() {
        return id;
    }

    public String getNaziv() {
        return naziv;
    }

    public void setNaziv(String naziv) {
        this.naziv = naziv;
    }

    public String getOpis() {
        return opis;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public int getCasPriprave() {
        return casPriprave;
    }

    public void setCasPriprave(int casPriprave) {
        this.casPriprave = casPriprave;
    }

    public String getKategorija() {
        return kategorija;
    }

    public void setKategorija(String kategorija) {
        this.kategorija = kategorija;
    }

    public String getNavodilaPriprave() {
        return navodilaPriprave;
    }

    public void setNavodilaPriprave(String navodilaPriprave) {
        this.navodilaPriprave = navodilaPriprave;
    }

    public List<Sestavina> getSestavine() {
        return sestavine;
    }

    public void setSestavine(List<Sestavina> sestavine) {
        this.sestavine.clear();
        if (sestavine != null) {
            this.sestavine.addAll(sestavine);
        }
    }
}
